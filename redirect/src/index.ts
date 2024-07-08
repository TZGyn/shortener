import { Elysia } from 'elysia'
import { db } from './database'
import { cors } from '@elysiajs/cors'
import { UAParser } from 'ua-parser-js'

const fallback_url = Bun.env.FALLBACK_URL ?? 'https://app.kon.sh'
const app_url = Bun.env.APP_URL ?? 'kon.sh'

const app = new Elysia().use(cors())

app.get('/', ({ set }) => (set.redirect = fallback_url + '/landing'))
app.get('/invalid', () => 'Invalid Shortener')

app.get(
	'/:shortenerCode',
	async ({ params: { shortenerCode }, set, request }) => {
		try {
			const request_domain = request.headers.get('host')
			const domain = request_domain !== app_url ? request_domain : null

			const ip = request.headers.get('x-forwarded-for')

			const geolocation = await (
				await fetch(`https://api.ipbase.com/v2/info?ip=${ip}`)
			).json()

			const user_agent = request.headers.get('User-Agent')

			const ua_parser = new UAParser(user_agent ?? '')

			const query = db
				.selectFrom('shortener')
				.leftJoin('project', 'project.id', 'shortener.project_id')
				.selectAll('shortener')
				.select(['project.custom_domain as domain'])
				.where('shortener.code', '=', shortenerCode)
				.where('project.custom_domain', '=', domain)
				.orderBy('created_at', 'desc')

			if (domain) {
				query.where('project.enable_custom_domain', '=', true)
			}

			const shortener = await query.execute()

			if (!shortener.length || !shortener[0].active) {
				set.redirect = '/invalid'
				return
			}

			const visitor_data = {
				shortener_id: shortener[0].id,
				country: geolocation.data.location.country.name as string,
				country_code: geolocation.data.location.country
					.alpha2 as string,
				city: geolocation.data.location.city.name as string,
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
