import type { PageServerLoad } from './$types'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema } from './schema'
import type { Actions } from './$types'
import { db } from '$lib/db'
import { redirect } from '@sveltejs/kit'
import { shortener } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import { isAlphanumeric } from '$lib/utils'

export const load = (async (event) => {
	const user = event.locals.user
	const { id } = event.params

	const shortener = await db.query.shortener.findFirst({
		columns: {
			id: true,
			code: true,
			projectId: true,
			ios: true,
			ios_link: true,
			android: true,
			android_link: true,
			link: true,
			active: true,
		},
		where: (shortener, { eq, and }) =>
			and(eq(shortener.code, id), eq(shortener.userId, user.id)),
	})

	if (!shortener) {
		redirect(300, `/dashboard/links`)
	}

	return {
		shortener,
		form: await superValidate(
			{
				...shortener,
				custom_code_enable: true,
				custom_code: shortener.code,
			},
			zod(formSchema),
			{ errors: false },
		),
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

		const user = event.locals.user

		if (form.data.custom_code_enable) {
			if (!form.data.custom_code) {
				return setError(
					form,
					'custom_code',
					'Please Enter Custom Code',
				)
			}
			if (!isAlphanumeric(form.data.custom_code)) {
				return setError(
					form,
					'custom_code',
					'Code cannot contain special characters',
				)
			}

			const customCodeExist = await db.query.shortener.findMany({
				where: (shortener, { eq, and, ne }) =>
					and(
						eq(shortener.code, form.data.custom_code),
						ne(shortener.id, event.params.id),
					),
				with: {
					project: true,
				},
			})

			for (const shortener of customCodeExist) {
				if (!shortener.project) {
					return setError(
						form,
						'custom_code',
						'Duplicated Custom Code',
					)
				}
			}
		}

		await db
			.update(shortener)
			.set({
				link: form.data.link,
				userId: user.id,
				code: form.data.custom_code_enable
					? form.data.custom_code
					: undefined,
				ios: form.data.ios,
				ios_link: form.data.ios_link,
				android: form.data.android,
				android_link: form.data.android_link,
			})
			.where(eq(shortener.id, event.params.id))

		return { form }
	},
}
