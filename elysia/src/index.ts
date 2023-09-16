import { Elysia } from 'elysia'
import { nanoid } from 'nanoid'
import { db } from './database'
import { createLinkSchema } from './zodSchema'

const app = new Elysia()

app.get('/', () => 'Hello Elysia')
app.get('/invalid', () => 'Invalid Shortener')

app.get('/link', async () => {
	const shorteners = await db.selectFrom('shortener').selectAll().execute()

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

app.get('/:shortenerCode', async ({ params: { shortenerCode }, set }) => {
	const shortener = await db
		.selectFrom('shortener')
		.selectAll()
		.where('code', '=', shortenerCode)
		.execute()

	if (!shortener.length) {
		set.redirect = '/invalid'
		return
	}

	set.redirect = shortener[0].link
})

app.listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
