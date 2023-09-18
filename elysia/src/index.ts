import { Elysia } from 'elysia'
import { nanoid } from 'nanoid'
import { db } from './database'
import { createLinkSchema } from './zodSchema'
import { cors } from '@elysiajs/cors'
import { jsonArrayFrom } from 'kysely/helpers/postgres'

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

app.post('/link', async ({ body }) => {
	const createLink = createLinkSchema.safeParse(body)

	if (!createLink.success) {
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

		const shortener = await db
			.selectFrom('shortener')
			.selectAll()
			.where('code', '=', shortenerCode)
			.orderBy('created_at', 'desc')
			.execute()

		const visitor_data = {
			shortener_id: shortener[0].id,
			country: geolocation.data.location.country.name as string,
		}

		await db.insertInto('visitor').values(visitor_data).execute()

		if (!shortener.length) {
			set.redirect = '/invalid'
			return
		}

		set.redirect = shortener[0].link
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
						'visitor.country',
					])
					.whereRef('visitor.shortener_id', '=', 'shortener.id')
			).as('visitors'),
		])
		.where('code', '=', shortenerCode)
		.execute()

	return { shorteners }
})

app.listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
