import type { RequestEvent } from '@sveltejs/kit'
import { db } from '$lib/db'
import { session as sessionSchema } from '$lib/db/schema'
import { eq } from 'drizzle-orm'

export const getUserFromSessionToken = async (token: string) => {
	const now = new Date()
	const sessions = await db.query.session.findFirst({
		with: {
			user: true,
		},
		where: (session, { eq, gt, and }) =>
			and(eq(session.token, token), gt(session.expiresAt, now)),
	})

	const session = sessions

	if (!session) {
		return null
	}
	return session.user
}

export const authenticateUser = async (event: RequestEvent) => {
	const { cookies } = event
	const sessionToken = cookies.get('token')

	if (!sessionToken) {
		return null
	}

	const user = await getUserFromSessionToken(sessionToken)

	return user?.id ?? null
}

export const logoutUser = async (token: string) => {
	const now = new Date()
	await db
		.update(sessionSchema)
		.set({ expiresAt: now })
		.where(eq(sessionSchema.token, token))
}
