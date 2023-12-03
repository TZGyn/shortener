import { z } from 'zod'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { project } from '$lib/db/schema'

export const GET: RequestHandler = async () => {
	return new Response()
}

const projectInsertSchema = z.object({
	name: z.string(),
})

export const POST: RequestHandler = async (event) => {
	const body = await event.request.json()

	const projectInsert = projectInsertSchema.safeParse(body)

	if (!projectInsert.success) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Invalid Data',
			}),
		)
	}

	const user = event.locals.userObject

	await db.insert(project).values({
		name: projectInsert.data.name,
		userId: user.id,
	})

	return new Response(JSON.stringify({ success: true }))
}
