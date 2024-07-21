import { db } from '$lib/db'
import {
	emailVerificationToken,
	user as userTable,
} from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import { isWithinExpirationDate } from 'oslo'
import type { PageServerLoad } from './$types'
import { lucia } from '$lib/server/auth'
import { env } from '$env/dynamic/private'

export const load: PageServerLoad = async (event) => {
	const verificationToken = event.params.token

	const token = await db.transaction(async (tx) => {
		const token = await tx.query.emailVerificationToken.findFirst({
			where: (emailVerificationToken, { eq }) =>
				eq(emailVerificationToken.id, verificationToken),
		})
		if (token) {
			await tx
				.delete(emailVerificationToken)
				.where(eq(emailVerificationToken.id, verificationToken))
		}
		return token
	})

	if (!token || !isWithinExpirationDate(token.expiresAt)) {
		return { verified: false }
	}

	const user = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, token.userId),
	})

	if (!user || user.email !== token.email) {
		return { verified: false }
	}

	await lucia.invalidateUserSessions(user.id)
	await db
		.update(userTable)
		.set({
			email_verified: true,
		})
		.where(eq(userTable.id, user.id))

	const session = await lucia.createSession(user.id, {})
	const sessionCookie = lucia.createSessionCookie(session.id)

	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		...sessionCookie.attributes,
		path: '/',
		secure: env.APP_ENV === 'prod',
	})

	return { verified: true }
}
