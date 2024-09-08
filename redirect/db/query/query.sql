-- name: ListShorteners :many
SELECT *
FROM shortener;
-- name: GetShortener :one
SELECT *
FROM shortener
WHERE code = $1
LIMIT 1;
-- name: GetShortenerWithDomain :one
SELECT shortener.*,
	project.custom_domain as domain
FROM shortener
	LEFT JOIN project ON project.id = shortener.project_id
WHERE shortener.code = $1
	AND project.custom_domain = $2
	AND project.enable_custom_domain IS TRUE
LIMIT 1;
-- name: CreateVisitor :exec
INSERT INTO visitor (
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
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);