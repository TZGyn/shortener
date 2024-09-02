import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { setError, superValidate } from 'sveltekit-superforms'
import { formSchema } from './schema'
import { zod } from 'sveltekit-superforms/adapters'
import { db } from '$lib/db'
import { user as userSchema } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import { lucia } from '$lib/server/auth'
import { env } from '$env/dynamic/private'
import { sendEmailVerification } from '$lib/server/email'
import * as argon2 from 'argon2'

export const load = (async (event) => {
	return {
		form: await superValidate(zod(formSchema)),
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema))
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}

		if (form.data.password !== form.data.password_confirm) {
			return setError(form, 'password_confirm', 'Password Not Match')
		}

		const users = await db
			.select()
			.from(userSchema)
			.where(eq(userSchema.email, form.data.email))

		const user = users[0]

		if (user) {
			if (user.googleId) {
				return setError(
					form,
					'email',
					'This email is detected on Google login, please login via Google',
				)
			}
			return setError(form, 'email', 'Email Already Exist')
		}

		const hashedPassword = await argon2.hash(form.data.password)
		const returnUsers = await db
			.insert(userSchema)
			.values({
				email: form.data.email,
				password: hashedPassword,
			})
			.returning()

		const session = await lucia.createSession(returnUsers[0].id, {})
		const sessionCookie = lucia.createSessionCookie(session.id)

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			...sessionCookie.attributes,
			path: '/',
			secure: env.APP_ENV === 'prod',
		})

		await sendEmailVerification({
			userId: returnUsers[0].id,
			email: form.data.email,
		})

		const redirectUrl = event.url.searchParams.get('redirect')

		if (redirectUrl) {
			redirect(302, redirectUrl)
		}

		return {
			form,
		}
	},
}
