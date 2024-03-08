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

	if (userUpdateData.data.old_password.length > 0) {
		const userData = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.id, userId),
		})

		if (!userData) {
			return new Response(
				JSON.stringify({ success: false, error: 'Cant Find User' }),
			)
		}

		const passwordMatch = await Bun.password.verify(
			userUpdateData.data.old_password,
			userData.password,
		)

		if (
			!passwordMatch ||
			userUpdateData.data.new_password !==
				userUpdateData.data.confirm_password
		) {
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Password Not Match',
				}),
			)
		}

		const newPassword = await Bun.password.hash(
			userUpdateData.data.new_password,
		)

		await db
			.update(user)
			.set({
				password: newPassword,
			})
			.where(eq(user.id, userId))
	}

	return new Response(JSON.stringify({ success: true }))
}
