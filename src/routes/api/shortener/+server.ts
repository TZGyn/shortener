import { z } from 'zod'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { getUserFromSessionToken } from '$lib/server/auth'
import { shortener } from '$lib/db/schema'
import { nanoid } from 'nanoid'

export const GET: RequestHandler = async () => {
	return new Response()
}

const shortenerInsertSchema = z.object({
	link: z.string().url(),
})

export const POST: RequestHandler = async (event) => {
	const body = await event.request.json()

	const shortenerInsert = shortenerInsertSchema.safeParse(body)

	if (!shortenerInsert.success) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Invalid Link',
			}),
		)
	}

	const token = event.cookies.get('token')

	if (!token) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Invalid User',
			}),
		)
	}

	const user = await getUserFromSessionToken(token)

	if (!user) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Invalid User',
			}),
		)
	}

	const code = nanoid(8)

	await db.insert(shortener).values({
		link: shortenerInsert.data.link,
		userId: user,
		code: code,
	})

	return new Response(JSON.stringify(body))
}
