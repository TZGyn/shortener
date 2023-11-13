import type { RequestEvent } from '@sveltejs/kit'
import { db } from '$lib/db'
import { session as sessionSchema } from '$lib/db/schema'
import { and, eq, gt } from 'drizzle-orm'

export const getUserFromSessionToken = async (token: string) => {
	const now = new Date()
	const sessions = await db
		.select()
		.from(sessionSchema)
		.where(
			and(eq(sessionSchema.token, token), gt(sessionSchema.expiresAt, now)),
		)

	const session = sessions[0]

	if (!session) {
		return null
	}
	return session.userId
}

export const authenticateUser = async (event: RequestEvent) => {
	const { cookies } = event
	const sessionToken = cookies.get('token')

	if (!sessionToken) {
		return null
	}

	console.log(sessionToken)

	const user = await getUserFromSessionToken(sessionToken)
	console.log(user)

	return user
}
