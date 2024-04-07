import type { RequestHandler } from './$types'
import { user as userSchema } from '$lib/db/schema'
import { db } from '$lib/db'
import { eq } from 'drizzle-orm'
import { userLoginSchema } from '$lib/server/types'
import { lucia } from '$lib/server/auth'

export const GET: RequestHandler = async () => {
	return new Response()
}

export const POST: RequestHandler = async (event) => {
	const body = await event.request.json()

	const userLogin = userLoginSchema.safeParse(body)

	if (!userLogin.success) {
		return new Response(
			JSON.stringify({
				success: false,
			}),
		)
	}

	const users = await db
		.select()
		.from(userSchema)
		.where(eq(userSchema.email, userLogin.data.email))

	const user = users[0]
	const matchPassword =
		user &&
		(await Bun.password.verify(
			userLogin.data.password,
			user.password,
		))

	if (user && matchPassword) {
		const session = await lucia.createSession(user.id, {})
		const sessionCookie = lucia.createSessionCookie(session.id)

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			...sessionCookie.attributes,
			path: '/',
			secure: Bun.env.APP_ENV === 'prod',
		})

		return new Response(JSON.stringify({ success: true }))
	} else {
		return new Response(JSON.stringify({ success: false }))
	}
}
