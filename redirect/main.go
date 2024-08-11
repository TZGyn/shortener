package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"
	"tzgyn/kon-redirect/db"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/joho/godotenv"
	"github.com/mileusna/useragent"
	"github.com/oschwald/geoip2-golang"
	"github.com/patrickmn/go-cache"
	"github.com/robfig/cron/v3"
	"github.com/ua-parser/uap-go/uaparser"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("No .env found")
	}

	parser, err := uaparser.New("./regexes.yaml")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Initializing GeoLite2 DB...")

	_, err = os.Stat("./data/GeoLite2-City.mmdb")

	if err != nil {
		fmt.Println("GeoLite2 DB Not Found...")
		err := downloadAndExtractDB()
		if err != nil {
			log.Fatal(err)
		}
	}

	geodb, err := geoip2.Open("./data/GeoLite2-City.mmdb")
	if err != nil {
		log.Fatal("Failed to initialize GeoLite2 DB")
	}

	fmt.Println("Finished initializing GeoLite2 DB")

	fmt.Println("Initializing postgres DB and cache...")
	ctx := context.Background()

	c := cache.New(1*time.Hour, 5*time.Minute)

	c.Set("key", "value", cache.DefaultExpiration)

	dbUrl := os.Getenv("DATABASE_URL")
	if len(dbUrl) == 0 {
		log.Fatal("DATABASE_URL not found")
	}

	conn, err := pgx.Connect(ctx, dbUrl)
	if err != nil {
		log.Fatal(err)
	}

	queries := db.New(conn)

	fmt.Println("Finished initializing postgres DB and cache")

	cache_client := cache.New(1*time.Hour, 5*time.Minute)

	app := fiber.New()

	app.Use(logger.New())
	app.Use(limiter.New(limiter.Config{
		Max:        20,
		Expiration: 1 * time.Minute,
	}))

	app.Static("/", "./public")

	fallbackurl := os.Getenv("FALLBACK_URL")
	if len(fallbackurl) == 0 {
		fallbackurl = "https://app.kon.sh"
	}

	appurl := os.Getenv("APP_URL")
	if len(appurl) == 0 {
		appurl = "kon.sh"
	}

	app.Get("/", func(c *fiber.Ctx) error {
		return c.Redirect(fallbackurl)
	})

	app.Get("/:code", func(c *fiber.Ctx) error {
		code := c.Params("code")
		domain := c.Hostname()

		uastring := c.GetReqHeaders()["User-Agent"][0]
		ua := useragent.Parse(uastring)
		client := parser.Parse(uastring)

		redirecturl := ""
		var shortenerId int32

		if domain == appurl {
			shortener, err := queries.GetShortener(ctx, code)
			shortenerId = shortener.ID
			if err != nil {
				return c.Redirect(fallbackurl)
			}
			if ua.OS == "iOS" && shortener.Ios && len(shortener.IosLink.String) != 0 {
				redirecturl = shortener.IosLink.String
			} else if ua.OS == "Android" && shortener.Android && len(shortener.AndroidLink.String) != 0 {
				redirecturl = shortener.AndroidLink.String
			} else {
				redirecturl = shortener.Link
			}
		} else {
			shortener, err := queries.GetShortenerWithDomain(ctx, db.GetShortenerWithDomainParams{
				Code:         code,
				CustomDomain: pgtype.Text{String: domain, Valid: true},
			})
			shortenerId = shortener.ID
			if err != nil {
				return c.Redirect(fallbackurl)
			}
			if ua.OS == "iOS" && shortener.Ios && len(shortener.IosLink.String) != 0 {
				redirecturl = shortener.IosLink.String
			} else if ua.OS == "Android" && shortener.Android && len(shortener.AndroidLink.String) != 0 {
				redirecturl = shortener.AndroidLink.String
			} else {
				redirecturl = shortener.Link
			}
		}

		ip := c.IPs()[0]

		_, found := cache_client.Get(ip + "_" + string(shortenerId))
		if found {
			return c.Redirect(redirecturl)
		}

		cache_client.Set(ip+"_"+string(shortenerId), true, cache.DefaultExpiration)

		record, err := getCity(geodb, ip)
		if err != nil {
			return c.Redirect(redirecturl)
		}

		devicetype := ""
		if ua.Mobile {
			devicetype = "mobile"
		} else if ua.Tablet {
			devicetype = "tablet"
		} else if ua.Desktop {
			devicetype = "desktop"
		}

		err = queries.CreateVisitor(ctx, db.CreateVisitorParams{
			ShortenerID:  shortenerId,
			DeviceType:   devicetype,
			DeviceVendor: client.Device.Brand,
			Browser:      client.UserAgent.Family,
			Os:           client.Os.Family,
			Country:      record.Country.Names["en"],
			CountryCode:  record.Country.IsoCode,
			City:         record.City.Names["en"],
		})

		if err != nil {
			return c.Redirect(redirecturl)
		}

		return c.Redirect(redirecturl)
	})

	cron := cron.New()
	cron.AddFunc("@weekly", func() {
		fmt.Println("Updating GeoLite2 DB...")
		err := downloadAndExtractDB()
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Finished updating GeoLite2 DB")
	})

	cron.Start()

	done := make(chan os.Signal, 1)
	signal.Notify(done, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)

	go func() {
		<-done
		fmt.Println("Gracefully shutting down...")
		_ = app.Shutdown()
	}()

	if err := app.Listen(":3000"); err != nil {
		log.Panic(err)
	}

	fmt.Println("Running cleanup tasks...")
	fmt.Println("Stopping cronjobs...")
	cron.Stop()
	geodb.Close()
	conn.Close(ctx)
}
