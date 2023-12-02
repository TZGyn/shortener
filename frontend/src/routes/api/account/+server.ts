import { db } from '$lib/db'
import { user } from '$lib/db/schema'
import { userUpdateSchema } from '$lib/server/types'
import { eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	return new Response()
}

export const PUT: RequestHandler = async (event) => {
	const body = await event.request.json()
	const userId = event.locals.userObject.id

	const userUpdateData = userUpdateSchema.safeParse(body)

	if (!userUpdateData.success) {
		return new Response(JSON.stringify({ success: false }))
	}

	await db
		.update(user)
		.set({
			username: userUpdateData.data.username,
		})
		.where(eq(user.id, userId))

	return new Response(JSON.stringify({ success: true }))
}
