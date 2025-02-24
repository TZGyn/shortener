<p align="center">
	<img width="100" src="./docs/logo.png" alt="logo">
</p>
<h1 align="center">
	Kon.sh
</h1>

[Kon.sh](https://app.kon.sh) is an open source URL shortener with analytics.
Made with [SvelteKit](https://kit.svelte.dev/) and [shadcn-svelte](https://www.shadcn-svelte.com/).

> **Note** > <br>
> Please read the breaking changes section for self-hosted builds before 23 July 2024
> <br>
> Feel free to contribute by creating pull requests, issues and discussions.

## Preview

![links_preview](./docs/screenshot_links.png)
![qr_preview](./docs/screenshot_qr.png)
![analytics_preview](./docs/screenshot_analytics.png)
![file_upload](./docs/file-upload.png)

### One Click Deploy on Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/bWnD5H?referralCode=bSruGU)

## Development

### Frontend

```bash
# copy .env.example to .env and fill in the environments
bun install
npm run dev
```

### Redirect

```bash
# copy .env.example to .env and fill in the environments
go mod download
go run main.go # or air run main.go
```

## Deployment

### Frontend

```bash
npm install
npm run build
node build
```

### Redirect

```bash
go build
./main
```

## Breaking Changes (For builds before this date)

### 9 February 2025

Migrate using polar.sh, if you want to keep using stripe you must add `PAYMENT_PROVIDER=stripe` to .env

All stripe related features will be removed soon

### 24 December 2024

New file upload feature requires a tigris/s3 bucket with webhook setup in order to work properly

### 29 August 2024

Using stripe customer id instead of stripe subscription id

Existing customer subscription id will be removed from database, so have to manually find every customer with the same email and fill in their ids

### 23 July 2024

Transition from using ipbase to using geoipupdate for geolocation.

Please add the following environment variables to your .env file

```bash
GEOIPUPDATE_ACCOUNT_ID=
GEOIPUPDATE_LICENSE_KEY=
```

### 16 June 2024

(WARNING) Please backup your database before attempting

A change is made to auto migrate the database on build using drizzle-kit migrate. If you wish to continue manual migration you may delete this line from the Dockerfile

```Dockerfile
RUN bun run db:migrate
```

If you are running a build before 16 June 2024 and planning to update the project, please run the following sql command in your database.

Command to run:

```sql
CREATE SCHEMA drizzle;

CREATE TABLE drizzle.__drizzle_migrations (
    id serial PRIMARY key,
    hash text NOT NULL,
    created_at bigint
);

INSERT INTO drizzle."__drizzle_migrations" (hash,created_at) VALUES
	 ('dc4a942d4d0a7a90611888a9d3b4e39065cc7930f57a9f8082911b682bffe59a',1699851315914),
	 ('39813033df939e2ff70dfde789b915a527bd332918e647b30cdb325bcd7f9f31',1700134783172),
	 ('92e2f3d605903cffbac434f53049b9c28e597b759c9356833578f79270052840',1700882455122),
	 ('f5925084d194592b01f7899e5c76a67f6b711b0d1a83623c2c922a38da70503e',1701590526323),
	 ('d3b8bbbd3ab40d337036c3049fa752ed9fb193f94cc4935670f5f7fec742b72d',1704723435338),
	 ('613e79d9eaec544795abd5a616c5cb3c3fac95fa7570ca0522bd8f063e97afed',1704837856450),
	 ('9b6cbf2d2b0eafc41ae6ef490439f246287aa6c2c984b430abeb469279edbc54',1710268627832),
	 ('aac3ec22a701ad950c73294b569737bbd4a92630d0812affcceb8a3ff620f41a',1712463213571),
	 ('401271104970a10e610ffc0426d2d02c9e3a2c108ac314969703eec94c3613d1',1713678115996),
	 ('d3465de1d47d507b8d0f4546f83ff4bbb827acac22f2665e7ae1550fef884339',1713800868341);
INSERT INTO drizzle."__drizzle_migrations" (hash,created_at) VALUES
	 ('ddf6b0134407cacee74734efdd67d2403d92a6b347e31fa039f4b0d64c0680f6',1714395864654);
```
