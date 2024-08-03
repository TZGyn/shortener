import { Elysia } from 'elysia'
import { db } from './database'
import { cors } from '@elysiajs/cors'
import { UAParser } from 'ua-parser-js'
import geoip2 from '@maxmind/geoip2-node'
import { rateLimit } from 'elysia-rate-limit'
import { LRUCache } from 'lru-cache'

const WebServiceClient = geoip2.WebServiceClient

const fallback_url = Bun.env.FALLBACK_URL ?? 'https://app.kon.sh'
const app_url = Bun.env.APP_URL ?? 'kon.sh'
const hosting_provider = Bun.env.HOSTING_PROVIDER

const client = new WebServiceClient(
	Bun.env.GEOIPUPDATE_ACCOUNT_ID || '',
	Bun.env.GEOIPUPDATE_LICENSE_KEY || '',
	{ host: 'geolite.info' }
)

const clickLimiter = new LRUCache({
	ttl: 60 * 60 * 60 * 1000, // 1 hr
	ttlAutopurge: true,
})

const app = new Elysia().use(cors()).use(rateLimit({ duration: 1000 }))

app.get('/', ({ set }) => (set.redirect = fallback_url + '/landing'))
app.get('/invalid', () => 'Invalid Shortener')
app.get('/robots.txt', () => Bun.file('public/robots.txt'))

app.get(
	'/:shortenerCode',
	async ({ params: { shortenerCode }, set, request, cookie }) => {
		try {
			const request_domain = request.headers.get('host')
			const domain = request_domain !== app_url ? request_domain : null

			const ip = request.headers.get(
				hosting_provider === 'fly.io'
					? 'Fly-Client-IP'
					: 'x-forwarded-for'
			)

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

			const user_agent = request.headers.get('User-Agent')

			const ua_parser = new UAParser(user_agent ?? '')

			if (!shortener.length || !shortener[0].active) {
				set.redirect = '/invalid'
				return
			}

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

			const clickKey = `${ip}_${shortener[0].id}`
			const clickLimited = clickLimiter.has(clickKey)

			if (clickLimited) return

			clickLimiter.set(clickKey, 1)

			const geolocation = await client.city(ip || '')

			const visitor_data = {
				shortener_id: shortener[0].id,
				country: geolocation.country!.names.en,
				country_code: geolocation.country!.isoCode,
				city: geolocation.city!.names.en,
				device_type: ua_parser.getDevice().type || 'desktop',
				device_vendor: ua_parser.getDevice().vendor,
				browser: ua_parser.getBrowser().name,
				os: ua_parser.getOS().name,
			}

			await db.insertInto('visitor').values(visitor_data).execute()
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
