// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: query.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const createVisitor = `-- name: CreateVisitor :exec
INSERT INTO visitor (
		id,
		shortener_id,
		device_type,
		device_vendor,
		browser,
		os,
		country,
		country_code,
		city,
		referer
	)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
`

type CreateVisitorParams struct {
	ID           string
	ShortenerID  string
	DeviceType   string
	DeviceVendor string
	Browser      string
	Os           string
	Country      string
	CountryCode  string
	City         string
	Referer      string
}

func (q *Queries) CreateVisitor(ctx context.Context, arg CreateVisitorParams) error {
	_, err := q.db.Exec(ctx, createVisitor,
		arg.ID,
		arg.ShortenerID,
		arg.DeviceType,
		arg.DeviceVendor,
		arg.Browser,
		arg.Os,
		arg.Country,
		arg.CountryCode,
		arg.City,
		arg.Referer,
	)
	return err
}

const getShortener = `-- name: GetShortener :one
SELECT shortener.id, link, code, created_at, shortener.user_id, project_id, active, ios, ios_link, android, android_link, is_file_upload, file_path, project.id, uuid, name, project.user_id, qr_background, qr_foreground, custom_domain, domain_status, enable_custom_domain, custom_ip, custom_domain_id, qr_corner_square_style, qr_dot_style, qr_image_base64
FROM shortener
	LEFT JOIN project ON project.id = shortener.project_id
WHERE code = $1
	AND (
		shortener.project_id IS NULL
		OR project.enable_custom_domain IS FALSE
	)
LIMIT 1
`

type GetShortenerRow struct {
	ID                  string
	Link                string
	Code                string
	CreatedAt           pgtype.Timestamp
	UserID              string
	ProjectID           pgtype.Text
	Active              bool
	Ios                 bool
	IosLink             pgtype.Text
	Android             bool
	AndroidLink         pgtype.Text
	IsFileUpload        bool
	FilePath            pgtype.Text
	ID_2                pgtype.Text
	Uuid                pgtype.UUID
	Name                pgtype.Text
	UserID_2            pgtype.Text
	QrBackground        pgtype.Text
	QrForeground        pgtype.Text
	CustomDomain        pgtype.Text
	DomainStatus        pgtype.Text
	EnableCustomDomain  pgtype.Bool
	CustomIp            pgtype.Text
	CustomDomainID      pgtype.Text
	QrCornerSquareStyle pgtype.Text
	QrDotStyle          pgtype.Text
	QrImageBase64       pgtype.Text
}

func (q *Queries) GetShortener(ctx context.Context, code string) (GetShortenerRow, error) {
	row := q.db.QueryRow(ctx, getShortener, code)
	var i GetShortenerRow
	err := row.Scan(
		&i.ID,
		&i.Link,
		&i.Code,
		&i.CreatedAt,
		&i.UserID,
		&i.ProjectID,
		&i.Active,
		&i.Ios,
		&i.IosLink,
		&i.Android,
		&i.AndroidLink,
		&i.IsFileUpload,
		&i.FilePath,
		&i.ID_2,
		&i.Uuid,
		&i.Name,
		&i.UserID_2,
		&i.QrBackground,
		&i.QrForeground,
		&i.CustomDomain,
		&i.DomainStatus,
		&i.EnableCustomDomain,
		&i.CustomIp,
		&i.CustomDomainID,
		&i.QrCornerSquareStyle,
		&i.QrDotStyle,
		&i.QrImageBase64,
	)
	return i, err
}

const getShortenerWithDomain = `-- name: GetShortenerWithDomain :one
SELECT shortener.id, shortener.link, shortener.code, shortener.created_at, shortener.user_id, shortener.project_id, shortener.active, shortener.ios, shortener.ios_link, shortener.android, shortener.android_link, shortener.is_file_upload, shortener.file_path,
	project.custom_domain as domain
FROM shortener
	LEFT JOIN project ON project.id = shortener.project_id
WHERE shortener.code = $1
	AND project.custom_domain = $2
	AND project.enable_custom_domain IS TRUE
LIMIT 1
`

type GetShortenerWithDomainParams struct {
	Code         string
	CustomDomain pgtype.Text
}

type GetShortenerWithDomainRow struct {
	ID           string
	Link         string
	Code         string
	CreatedAt    pgtype.Timestamp
	UserID       string
	ProjectID    pgtype.Text
	Active       bool
	Ios          bool
	IosLink      pgtype.Text
	Android      bool
	AndroidLink  pgtype.Text
	IsFileUpload bool
	FilePath     pgtype.Text
	Domain       pgtype.Text
}

func (q *Queries) GetShortenerWithDomain(ctx context.Context, arg GetShortenerWithDomainParams) (GetShortenerWithDomainRow, error) {
	row := q.db.QueryRow(ctx, getShortenerWithDomain, arg.Code, arg.CustomDomain)
	var i GetShortenerWithDomainRow
	err := row.Scan(
		&i.ID,
		&i.Link,
		&i.Code,
		&i.CreatedAt,
		&i.UserID,
		&i.ProjectID,
		&i.Active,
		&i.Ios,
		&i.IosLink,
		&i.Android,
		&i.AndroidLink,
		&i.IsFileUpload,
		&i.FilePath,
		&i.Domain,
	)
	return i, err
}

const listShorteners = `-- name: ListShorteners :many
SELECT id, link, code, created_at, user_id, project_id, active, ios, ios_link, android, android_link, is_file_upload, file_path
FROM shortener
`

func (q *Queries) ListShorteners(ctx context.Context) ([]Shortener, error) {
	rows, err := q.db.Query(ctx, listShorteners)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Shortener
	for rows.Next() {
		var i Shortener
		if err := rows.Scan(
			&i.ID,
			&i.Link,
			&i.Code,
			&i.CreatedAt,
			&i.UserID,
			&i.ProjectID,
			&i.Active,
			&i.Ios,
			&i.IosLink,
			&i.Android,
			&i.AndroidLink,
			&i.IsFileUpload,
			&i.FilePath,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
