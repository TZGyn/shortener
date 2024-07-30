import { Elysia } from 'elysia'
import { db } from './database'
import { cors } from '@elysiajs/cors'
import { UAParser } from 'ua-parser-js'

const fallback_url = Bun.env.FALLBACK_URL ?? 'https://app.kon.sh'
const app_url = Bun.env.APP_URL ?? 'kon.sh'
const geoipupdate_account_id = Bun.env.GEOIPUPDATE_ACCOUNT_ID
const geoipupdate_license_key = Bun.env.GEOIPUPDATE_LICENSE_KEY
const hosting_provider = Bun.env.HOSTING_PROVIDER

const app = new Elysia().use(cors())

app.get('/', ({ set }) => (set.redirect = fallback_url + '/landing'))
app.get('/invalid', () => 'Invalid Shortener')

app.get(
	'/:shortenerCode',
	async ({ params: { shortenerCode }, set, request }) => {
		try {
			const request_domain = request.headers.get('host')
			const domain = request_domain !== app_url ? request_domain : null

			const ip = request.headers.get(
				hosting_provider === 'fly.io'
					? 'Fly-Client-IP'
					: 'x-forwarded-for'
			)

			const WebServiceClient =
				require('@maxmind/geoip2-node').WebServiceClient

			const client = new WebServiceClient(
				geoipupdate_account_id,
				geoipupdate_license_key,
				{ host: 'geolite.info' }
			)

			const geolocation = await client.city(ip)

			const user_agent = request.headers.get('User-Agent')

			const ua_parser = new UAParser(user_agent ?? '')

			const query = db
				.selectFrom('shortener')
				.selectAll('shortener')
				.where('shortener.code', '=', shortenerCode)

			if (domain) {
				query
					.leftJoin('project', 'project.id', 'shortener.project_id')
					.select(['project.custom_domain as domain'])
					.where('project.custom_domain', '=', domain)
					.where('project.enable_custom_domain', '=', true)
			}

			query.orderBy('created_at', 'desc')

			const shortener = await query.execute()

			console.log('shortener', shortener)

			if (!shortener.length || !shortener[0].active) {
				set.redirect = '/invalid'
				return
			}

			const visitor_data = {
				shortener_id: shortener[0].id,
				country: geolocation.country.names.en as string,
				country_code: geolocation.country.isoCode as string,
				city: geolocation.city.names.en as string,
				device_type: ua_parser.getDevice().type || 'desktop',
				device_vendor: ua_parser.getDevice().vendor,
				browser: ua_parser.getBrowser().name,
				os: ua_parser.getOS().name,
			}

			await db.insertInto('visitor').values(visitor_data).execute()

			if (
				ua_parser.getOS().name === 'iOS' &&
				shortener[0].ios &&
				shortener[0].ios_link
			) {
				set.redirect = shortener[0].ios_link
			} else if (
				ua_parser.getOS().name === 'Android' &&
				shortener[0].android &&
				shortener[0].android_link
			) {
				set.redirect = shortener[0].android_link
			} else {
				set.redirect = shortener[0].link
			}
		} catch (error) {
			console.error(error)
			set.redirect = fallback_url
		}
	}
)

app.listen(Bun.env.PORT ?? 3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
	`${Bun.env.PGDATABASE}`
)

export type App = typeof app
