import type { RequestHandler } from './$types'
import {
	user as userSchema,
	session as sessionSchema,
} from '$lib/db/schema'
import { db } from '$lib/db'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { userLoginSchema } from '$lib/server/types'

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
		const token = nanoid(32)

		const expiresAt = new Date()
		expiresAt.setTime(expiresAt.getTime() + 4 * 60 * 60 * 1000)

		await db
			.insert(sessionSchema)
			.values({ userId: user.id, token, expiresAt })

		event.cookies.set('token', token, {
			httpOnly: true,
			sameSite: 'strict',
			path: '/',
			secure: process.env.APP_ENV === 'prod' ? true : false,
			expires: expiresAt,
		})
		return new Response(JSON.stringify({ success: true }))
	} else {
		return new Response(JSON.stringify({ success: false }))
	}
}
