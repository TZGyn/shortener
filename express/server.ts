import express from 'express'
import { nanoid } from 'nanoid'
import { createLinkSchema } from './src/zodSchema'
import { db } from './src/database'

const app = express()
const port = 1234

app.use(express.json())

app.get('/', (req, res) => {
	res.json({ message: 'Hello', data: 'World' })
})

app.get('/link', async (req, res) => {
	const shorteners = await db.selectFrom('shortener').selectAll().execute()

	res.json({ shorteners })
})

app.post('/link', async (req, res) => {
	const body = req.body

	const createLink = createLinkSchema.safeParse(body)

	if (!createLink.success) {
		res.json({ message: 'Invalid Link', body })
		return
	}

	const uuid = nanoid(10)

	await db
		.insertInto('shortener')
		.values({
			link: createLink.data.link,
			code: uuid,
		})
		.execute()

	res.json({ ...createLink.data, uuid })
})

app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
})
