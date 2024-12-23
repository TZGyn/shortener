package main

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"
	"tzgyn/kon-redirect/db"

	"math/rand"

	"github.com/aws/aws-sdk-go-v2/aws"
	v4 "github.com/aws/aws-sdk-go-v2/aws/signer/v4"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/mileusna/useragent"
	"github.com/oschwald/geoip2-golang"
	"github.com/patrickmn/go-cache"
	"github.com/robfig/cron/v3"
	"github.com/ua-parser/uap-go/uaparser"
)

// Client encapsulates the S3 SDK presign client and provides methods to presign requests.
type Client struct {
	PresignClient *s3.PresignClient
}

// GetObject makes a presigned request that can be used to get an object from a bucket.
func (p *Client) GetObject(
	ctx context.Context,
	bucket string,
	key string,
	expiry time.Duration,
) (*v4.PresignedHTTPRequest, error) {
	request, err := p.PresignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = expiry
	})
	if err != nil {
		log.Printf("Couldn't get a presigned request to get %v:%v. Here's why: %v\n",
			bucket, key, err)
	}
	return request, err
}

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
	} else {
		fmt.Println("GeoLite2 DB Found, Skipping Download...")
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

	pgconfig, err := pgxpool.ParseConfig(dbUrl)
	if err != nil {
		log.Fatal(err)
	}

	pgconfig.MinConns = 4

	conn, err := pgxpool.NewWithConfig(ctx, pgconfig)

	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	fmt.Println("Finished initializing postgres DB and cache")

	fmt.Println("Initializing S3...")

	awsregion := os.Getenv("AWS_REGION")
	if len(awsregion) == 0 {
		log.Fatal("AWS_REGION not found")
	}

	s3endpoint := os.Getenv("AWS_ENDPOINT_URL_S3")
	if len(s3endpoint) == 0 {
		log.Fatal("AWS_ENDPOINT_URL_S3 not found")
	}

	s3bucket := os.Getenv("AWS_BUCKET_NAME")
	if len(s3bucket) == 0 {
		log.Fatal("AWS_BUCKET_NAME not found")
	}

	sdkConfig, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Printf("Couldn't load default configuration. Here's why: %v\n", err)
		return
	}

	svc := s3.NewFromConfig(sdkConfig, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(s3endpoint)
		o.Region = awsregion
	})

	// Presigning a request
	ps := s3.NewPresignClient(svc)
	presigner := &Client{PresignClient: ps}

	fmt.Println("Finished initializing S3")

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
	invalidUrl := fallbackurl + "/qr/invalid"

	app.Get("/", func(c *fiber.Ctx) error {
		return c.Redirect(fallbackurl, 301)
	})

	app.Get("/:code", func(c *fiber.Ctx) error {
		code := c.Params("code")
		domain := c.Hostname()

		uastrings := c.GetReqHeaders()["User-Agent"]

		redirecturl := ""
		var shortenerId string
		iosEnabled := false
		iosRedirectUrl := ""
		androidEnabled := false
		androidRedirectUrl := ""

		queries := db.New(conn)

		if domain == appurl {
			shortener, err := queries.GetShortener(ctx, code)
			if err != nil {
				return c.Redirect(invalidUrl)
			}
			shortenerId = shortener.ID

			iosEnabled = shortener.Ios
			androidEnabled = shortener.Android

			if shortener.IsFileUpload {
				// Presigned URL to download an object from the bucket
				presignedGetReq, err := presigner.GetObject(context.TODO(), s3bucket, shortener.FilePath.String, 65*time.Minute)
				if err != nil {
					log.Printf("Couldn't get a presigned request to get %s. Here's why: %v\n", shortener.FilePath.String, err)
					return c.Redirect(invalidUrl)
				}
				iosRedirectUrl = presignedGetReq.URL
				androidRedirectUrl = presignedGetReq.URL
				redirecturl = presignedGetReq.URL
			} else {
				iosRedirectUrl = shortener.IosLink.String
				androidRedirectUrl = shortener.AndroidLink.String
				redirecturl = shortener.Link
			}
		} else {
			shortener, err := queries.GetShortenerWithDomain(ctx, db.GetShortenerWithDomainParams{
				Code:         code,
				CustomDomain: pgtype.Text{String: domain, Valid: true},
			})
			if err != nil {
				return c.Redirect(invalidUrl)
			}
			shortenerId = shortener.ID

			iosEnabled = shortener.Ios
			androidEnabled = shortener.Android

			if shortener.IsFileUpload {
				// Presigned URL to download an object from the bucket
				presignedGetReq, err := presigner.GetObject(context.TODO(), s3bucket, shortener.FilePath.String, 10*time.Minute)
				if err != nil {
					log.Printf("Couldn't get a presigned request to get %s. Here's why: %v\n", shortener.FilePath.String, err)
					return c.Redirect(invalidUrl)
				}
				iosRedirectUrl = presignedGetReq.URL
				androidRedirectUrl = presignedGetReq.URL
				redirecturl = presignedGetReq.URL
			} else {
				iosRedirectUrl = shortener.IosLink.String
				androidRedirectUrl = shortener.AndroidLink.String
				redirecturl = shortener.Link
			}
		}

		if len(uastrings) == 0 {
			return c.Redirect(redirecturl)
		}

		uastring := uastrings[0]

		ua := useragent.Parse(uastring)
		client := parser.Parse(uastring)

		finalRedirectUrl := redirecturl
		if ua.OS == "iOS" && iosEnabled && len(iosRedirectUrl) != 0 {
			finalRedirectUrl = iosRedirectUrl
		} else if ua.OS == "Android" && androidEnabled && len(androidRedirectUrl) != 0 {
			finalRedirectUrl = androidRedirectUrl
		}

		ipList := c.IPs()

		if len(ipList) == 0 {
			return c.Redirect(finalRedirectUrl)
		}

		ip := ipList[0]

		_, found := cache_client.Get(ip + "_" + string(shortenerId))
		if found {
			return c.Redirect(finalRedirectUrl)
		}

		cache_client.Set(ip+"_"+string(shortenerId), true, cache.DefaultExpiration)

		if ua.Bot {
			return c.Redirect(finalRedirectUrl)
		}

		record, err := getCity(geodb, ip)
		if err != nil {
			return c.Redirect(finalRedirectUrl)
		}

		devicetype := ""
		if ua.Mobile {
			devicetype = "mobile"
		} else if ua.Tablet {
			devicetype = "tablet"
		} else if ua.Desktop {
			devicetype = "desktop"
		}

		referers := c.GetReqHeaders()["Referer"]

		referer := ""
		if len(referers) > 0 {
			referer = referers[0]
		}

		referer = getDomainWithoutWWW(referer)

		err = queries.CreateVisitor(ctx, db.CreateVisitorParams{
			ID:           generateRandomString(12),
			ShortenerID:  shortenerId,
			DeviceType:   devicetype,
			DeviceVendor: client.Device.Brand,
			Browser:      client.UserAgent.Family,
			Os:           client.Os.Family,
			Country:      record.Country.Names["en"],
			CountryCode:  record.Country.IsoCode,
			City:         record.City.Names["en"],
			Referer:      referer,
		})

		if err != nil {
			return c.Redirect(finalRedirectUrl)
		}

		return c.Redirect(finalRedirectUrl)
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
	conn.Close()
}

func getDomainWithoutWWW(str string) string {
	domain, err := url.ParseRequestURI(str)

	if err == nil {
		hostname := domain.Hostname()
		if strings.HasPrefix(hostname, "www.") {
			result, ok := strings.CutPrefix(hostname, "www.")
			if ok {
				hostname = result
			}
		}
		return hostname
	}

	if strings.ContainsAny(str, ".") && !strings.ContainsAny(str, " ") {
		domain, err = url.ParseRequestURI("https://" + str)
		if err == nil {
			hostname := domain.Hostname()
			if strings.HasPrefix(hostname, "www.") {
				result, ok := strings.CutPrefix(hostname, "www.")
				if ok {
					hostname = result
				}
			}
			return hostname
		}
	}

	return ""
}

func generateRandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	seed := rand.NewSource(time.Now().UnixNano())
	random := rand.New(seed)

	result := make([]byte, length)
	for i := range result {
		result[i] = charset[random.Intn(len(charset))]
	}
	return string(result)
}
