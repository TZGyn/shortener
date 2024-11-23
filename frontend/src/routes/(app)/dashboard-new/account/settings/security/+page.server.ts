import { db } from '$lib/db'
import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { setError, superValidate } from 'sveltekit-superforms'
import {
	changePasswordFormSchema,
	deleteAccountSchema,
} from './schema'
import { zod } from 'sveltekit-superforms/adapters'
import { project, shortener, user, visitor } from '$lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { lucia } from '$lib/server/auth'
import { env } from '$env/dynamic/private'
import * as argon2 from 'argon2'

export const load = (async (event) => {
	return {
		form: await superValidate(zod(changePasswordFormSchema)),
		deleteAccountForm: await superValidate(zod(deleteAccountSchema)),
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	change_password: async (event) => {
		const form = await superValidate(
			event,
			zod(changePasswordFormSchema),
		)
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}

		const userId = event.locals.user.id

		if (event.locals.user.googleId) {
			return setError(
				form,
				'old_password',
				'Unable to set a password if using google login',
			)
		}

		const userData = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.id, userId),
		})

		if (!userData) {
			return setError(form, 'old_password', 'User Not Found')
		}

		if (!userData.password) {
			return setError(
				form,
				'old_password',
				'User is using other login method',
			)
		}

		const passwordMatch = await argon2.verify(
			userData.password,
			form.data.old_password,
		)

		if (!passwordMatch) {
			return setError(form, 'old_password', 'Old Password Not Match')
		}

		const newPassword = await argon2.hash(form.data.new_password)

		await db
			.update(user)
			.set({
				password: newPassword,
			})
			.where(eq(user.id, userId))

		await lucia.invalidateUserSessions(userId)

		const session = await lucia.createSession(userId, {})
		const sessionCookie = lucia.createSessionCookie(session.id)

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			...sessionCookie.attributes,
			path: '/',
			secure: env.APP_ENV === 'prod',
		})

		return {
			form,
		}
	},
	delete_account: async (event) => {
		const form = await superValidate(event, zod(deleteAccountSchema))
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}

		const userId = event.locals.user.id

		const userData = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.id, userId),
		})

		if (!userData) {
			return setError(form, 'password', 'User Not Found')
		}

		if (userData.googleId) {
			await lucia.invalidateUserSessions(userId)

			await db.delete(user).where(eq(user.id, userId))

			const shorteners = await db
				.delete(shortener)
				.where(eq(shortener.userId, userId))
				.returning()

			await db.delete(project).where(eq(project.userId, userId))

			await db.delete(visitor).where(
				inArray(
					visitor.shortenerId,
					shorteners.map((shortener) => shortener.id),
				),
			)

			return {
				form,
			}
		}

		if (!userData.password) {
			return setError(form, 'password', 'User Not Found')
		}

		const passwordMatch = await argon2.verify(
			userData.password,
			form.data.password,
		)

		if (!passwordMatch) {
			return setError(form, 'password', 'Invalid Password')
		}

		await lucia.invalidateUserSessions(userId)

		await db.delete(user).where(eq(user.id, userId))

		const shorteners = await db
			.delete(shortener)
			.where(eq(shortener.userId, userId))
			.returning()

		await db.delete(project).where(eq(project.userId, userId))

		await db.delete(visitor).where(
			inArray(
				visitor.shortenerId,
				shorteners.map((shortener) => shortener.id),
			),
		)

		return {
			form,
		}
	},
}
