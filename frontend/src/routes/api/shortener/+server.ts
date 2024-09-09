import { z } from 'zod'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { shortener } from '$lib/db/schema'
import { nanoid } from 'nanoid'
import { generateId } from 'lucia'

export const GET: RequestHandler = async () => {
	return new Response()
}

const shortenerInsertSchema = z.object({
	link: z.string().url('Link must be in url format'),
	projectId: z.string().nullish(),
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

	const user = event.locals.user

	const code = nanoid(8)

	await db.insert(shortener).values({
		id: generateId(8),
		link: shortenerInsert.data.link,
		projectId: shortenerInsert.data.projectId,
		userId: user.id,
		code: code,
	})

	return new Response(JSON.stringify({ success: true }))
}
