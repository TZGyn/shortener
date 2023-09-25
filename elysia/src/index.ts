import { Elysia } from 'elysia'
import { nanoid } from 'nanoid'
import { db } from './database'
import { createLinkSchema } from './zodSchema'
import { cors } from '@elysiajs/cors'
import { jsonArrayFrom } from 'kysely/helpers/postgres'

const fallback_url = Bun.env.FALLBACK_URL ?? 'https://shortener.tzgyn.com'

const app = new Elysia().use(cors())

app.get('/', () => 'Hello Elysia')
app.get('/invalid', () => 'Invalid Shortener')

app.get('/link', async () => {
	const shorteners = await db
		.selectFrom('shortener')
		.leftJoin('visitor', 'visitor.shortener_id', 'shortener.id')
		.select(({ fn }) => [
			'shortener.id',
			'shortener.link',
			'shortener.code',
			'shortener.created_at',
			fn.count<number>('visitor.id').as('visitor_count'),
		])
		.groupBy('shortener.id')
		.execute()

	return { shorteners }
})

app.post('/link', async ({ body, set }) => {
	const createLink = createLinkSchema.safeParse(body)

	if (!createLink.success) {
		set.status = 400
		return { message: 'Invalid Link', body }
	}

	const uuid = nanoid(10)

	await db
		.insertInto('shortener')
		.values({
			link: createLink.data.link,
			code: uuid,
		})
		.execute()

	return { message: 'Success' }
})

app.get(
	'/:shortenerCode',
	async ({ params: { shortenerCode }, set, request }) => {
		const ip = request.headers.get('x-forwarded-for')

		const geolocation = await (
			await fetch(`https://api.ipbase.com/v2/info?ip=${ip}`)
		).json()

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

app.get('/link/:shortenerCode', async ({ params: { shortenerCode } }) => {
	const shorteners = await db
		.selectFrom('shortener')
		.select((shortener) => [
			'id',
			'code',
			'link',
			'created_at',
			jsonArrayFrom(
				shortener
					.selectFrom('visitor')
					.select([
						'visitor.created_at as visited_at',
						'visitor.country_code',
					])
					.whereRef('visitor.shortener_id', '=', 'shortener.id')
			).as('visitors'),
		])
		.where('code', '=', shortenerCode)
		.execute()

	const visitors = await db
		.selectFrom('visitor')
		.select(({ fn }) => [
			'visitor.country_code',
			'visitor.country',
			fn.count<number>('visitor.id').as('visitor_count'),
		])
		.where('visitor.shortener_id', '=', shorteners[0].id)
		.groupBy(['visitor.country_code', 'visitor.country'])
		.execute()

	return { shorteners, visitors }
})

app.listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
