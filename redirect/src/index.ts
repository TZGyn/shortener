import { Elysia } from 'elysia'
import { db } from './database'
import { cors } from '@elysiajs/cors'
import { UAParser } from 'ua-parser-js'

const fallback_url = Bun.env.FALLBACK_URL ?? 'https://shortener.tzgyn.com'

const app = new Elysia().use(cors())

app.get('/', () => 'Hello Elysia')
app.get('/invalid', () => 'Invalid Shortener')

app.get(
	'/:shortenerCode',
	async ({ params: { shortenerCode }, set, request }) => {
		const ip = request.headers.get('x-forwarded-for')

		const geolocation = await (
			await fetch(`https://api.ipbase.com/v2/info?ip=${ip}`)
		).json()

		const user_agent = request.headers.get('User-Agent')

		const ua_parser = new UAParser(user_agent ?? '')

		try {
			const shortener = await db
				.selectFrom('shortener')
				.selectAll()
				.where('code', '=', shortenerCode)
				.orderBy('created_at', 'desc')
				.execute()

			const visitor_data = {
				shortener_id: shortener[0].id,
				country: geolocation.data.location.country.name as string,
				country_code: geolocation.data.location.country
					.alpha2 as string,
				city: geolocation.data.location.city.name as string,
				device_type: ua_parser.getDevice().type,
				device_vendor: ua_parser.getDevice().vendor,
				os: ua_parser.getOS().name,
			}

			await db.insertInto('visitor').values(visitor_data).execute()

			if (!shortener.length) {
				set.redirect = '/invalid'
				return
			}

			set.redirect = shortener[0].link
		} catch {
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
