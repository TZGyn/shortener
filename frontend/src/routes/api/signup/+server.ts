import type { RequestHandler } from './$types'
import { user as userSchema } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import { userCreateSchema } from '$lib/server/types'
import { db } from '$lib/db'
import { lucia } from '$lib/server/auth'

export const GET: RequestHandler = async () => {
	return new Response()
}

export const POST: RequestHandler = async (event) => {
	const body = await event.request.json()

	const userCreate = userCreateSchema.safeParse(body)

	if (!userCreate.success) {
		return new Response(
			JSON.stringify({
				success: false,
			}),
		)
	}

	if (userCreate.data.password !== userCreate.data.password_confirm) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'password doesnt match',
			}),
		)
	}

	const users = await db
		.select()
		.from(userSchema)
		.where(eq(userSchema.email, userCreate.data.email))

	const user = users[0]

	if (!user) {
		const hashedPassword = await Bun.password.hash(
			userCreate.data.password,
		)
		const returnUsers = await db
			.insert(userSchema)
			.values({
				email: userCreate.data.email,
				password: hashedPassword,
			})
			.returning()

		const user = returnUsers[0]

		const session = await lucia.createSession(user.id, {})
		const sessionCookie = lucia.createSessionCookie(session.id)

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			...sessionCookie.attributes,
			path: '/',
			secure: Bun.env.APP_ENV === 'prod',
		})

		return new Response(
			JSON.stringify({
				success: true,
			}),
		)
	} else {
		return new Response(
			JSON.stringify({
				success: false,
			}),
		)
	}
}
