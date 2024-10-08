package main

import (
	"archive/tar"
	"compress/gzip"
	"encoding/base64"
	"errors"
	"io"
	"net"
	"net/http"
	"os"
	"path/filepath"

	"github.com/oschwald/geoip2-golang"
)

func getCity(db *geoip2.Reader, queryIp string) (*geoip2.City, error) {
	// If you are using strings that may be invalid, check that ip is not nil
	ip := net.ParseIP(queryIp)
	if ip == nil {
		return nil, errors.New("invalid ip")
	}

	record, err := db.City(ip)
	if err != nil {
		return nil, errors.New("no data")
	}
	return record, nil
}

func downloadAndExtractDB() error {
	_, err := os.ReadDir("./data")
	if err != nil {
		os.MkdirAll("./data", os.ModePerm)
	}

	_, err = os.ReadDir("./dist")
	if err != nil {
		os.MkdirAll("./dist", os.ModePerm)
	}

	err = downloadDB()
	if err != nil {
		return err
	}

	r, err := os.Open("./db.tar.gz")
	if err != nil {
		return err
	}

	err = Untar("./dist", r)
	if err != nil {
		return err
	}

	files, err := os.ReadDir("./dist")
	if err != nil {
		return err
	}

	fileInfo := files[0]

	err = os.Rename("./dist/"+fileInfo.Name()+"/GeoLite2-City.mmdb", "./data/GeoLite2-City.mmdb")
	if err != nil {
		return err
	}

	err = os.RemoveAll("./dist/")
	if err != nil {
		return err
	}

	err = os.MkdirAll("./dist/", os.ModePerm)
	if err != nil {
		return err
	}

	err = os.Remove("./db.tar.gz")
	if err != nil {
		return err
	}

	return nil
}

func downloadDB() error {
	accountID := os.Getenv("GEOIPUPDATE_ACCOUNT_ID")
	if len(accountID) == 0 {
		return errors.New("please provide ACCOUNT_ID as env")
	}

	licenseKey := os.Getenv("GEOIPUPDATE_LICENSE_KEY")
	if len(licenseKey) == 0 {
		return errors.New("please provide LICENSE_KEY as env")
	}

	out, err := os.Create("db.tar.gz")
	if err != nil {
		return err
	}

	defer out.Close()

	auth := base64.StdEncoding.EncodeToString([]byte(accountID + ":" + licenseKey))

	req, err := http.NewRequest(http.MethodGet, "https://download.maxmind.com/geoip/databases/GeoLite2-City/download?suffix=tar.gz", nil)
	if err != nil {
		return err
	}
	req.Header.Add("Authorization", "Basic "+auth)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	defer res.Body.Close()

	_, err = io.Copy(out, res.Body)
	if err != nil {
		return err
	}

	return nil
}

func Untar(dst string, r io.Reader) error {

	gzr, err := gzip.NewReader(r)
	if err != nil {
		return err
	}
	defer gzr.Close()

	tr := tar.NewReader(gzr)

	for {
		header, err := tr.Next()

		switch {

		// if no more files are found return
		case err == io.EOF:
			return nil

		// return any other error
		case err != nil:
			return err

		// if the header is nil, just skip it (not sure how this happens)
		case header == nil:
			continue
		}

		// the target location where the dir/file should be created
		target := filepath.Join(dst, header.Name)

		// the following switch could also be done using fi.Mode(), not sure if there
		// a benefit of using one vs. the other.
		// fi := header.FileInfo()

		// check the file type
		switch header.Typeflag {

		// if its a dir and it doesn't exist create it
		case tar.TypeDir:
			if _, err := os.Stat(target); err != nil {
				if err := os.MkdirAll(target, 0755); err != nil {
					return err
				}
			}

		// if it's a file create it
		case tar.TypeReg:
			f, err := os.OpenFile(target, os.O_CREATE|os.O_RDWR, os.FileMode(header.Mode))
			if err != nil {
				return err
			}

			// copy over contents
			if _, err := io.Copy(f, tr); err != nil {
				return err
			}

			// manually close here after each file operation; defering would cause each file close
			// to wait until all operations have completed.
			f.Close()
		}
	}
}
