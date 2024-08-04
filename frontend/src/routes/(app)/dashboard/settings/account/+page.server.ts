import { db } from '$lib/db'
import type { PageServerLoad, Actions } from './$types'
import { error, fail } from '@sveltejs/kit'
import {
	message,
	setError,
	superValidate,
} from 'sveltekit-superforms'
import { formSchema, verifyEmailSchema } from './schema'
import { zod } from 'sveltekit-superforms/adapters'
import { user } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import { sendEmailVerification } from '$lib/server/email'

export const load = (async (event) => {
	const { username, email } = event.locals.user

	return {
		form: await superValidate(
			{ username: username || '', email },
			zod(formSchema),
		),
		verify_email_form: await superValidate(zod(verifyEmailSchema)),
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	update: async (event) => {
		const form = await superValidate(event, zod(formSchema))
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}

		const userId = event.locals.user.id

		if (form.data.new_password) {
			if (!form.data.old_password) {
				return setError(form, 'old_password', 'Old Password Required')
			}
			const userData = await db.query.user.findFirst({
				where: (user, { eq }) => eq(user.id, userId),
			})

			if (!userData) {
				return setError(form, 'email', 'Email Not Found')
			}

			const passwordMatch = await Bun.password.verify(
				form.data.old_password,
				userData.password,
			)

			if (!passwordMatch) {
				return setError(
					form,
					'old_password',
					'Old Password Not Match',
				)
			}

			if (form.data.new_password !== form.data.confirm_password) {
				return setError(
					form,
					'confirm_password',
					'Password Not Match',
				)
			}

			const newPassword = await Bun.password.hash(
				form.data.new_password,
			)

			await db
				.update(user)
				.set({
					password: newPassword,
				})
				.where(eq(user.id, userId))
		}

		if (form.data.username) {
			await db
				.update(user)
				.set({
					username: form.data.username,
				})
				.where(eq(user.id, userId))
		}

		return {
			form,
		}
	},
	verify_email: async (event) => {
		const form = await superValidate(event, zod(verifyEmailSchema))
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}

		try {
			await sendEmailVerification({
				userId: event.locals.user.id,
				email: event.locals.user.email,
			})
		} catch (e) {
			return message(form, 'Error sending email verification', {
				status: 500,
			})
		}

		return message(form, 'Email verification sent')
	},
}
