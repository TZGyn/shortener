import { z } from 'zod'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { shortener } from '$lib/db/schema'
import { nanoid } from 'nanoid'

export const GET: RequestHandler = async () => {
	return new Response()
}

const shortenerInsertSchema = z.object({
	link: z.string().url('Link must be in url format'),
	projectId: z.number().nullish(),
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

	const user = event.locals.userObject

	const code = nanoid(8)

	await db.insert(shortener).values({
		link: shortenerInsert.data.link,
		projectId: shortenerInsert.data.projectId,
		userId: user.id,
		code: code,
	})

	return new Response(JSON.stringify({ success: true }))
}
