import { db } from '$lib/db'
import type { PageServerLoad } from './$types'
import { shortener } from '$lib/db/schema'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema } from './schema'
import type { Actions } from './$types'
import { nanoid } from 'nanoid'
import { isAlphanumeric } from '$lib/utils'
import { generateId } from 'lucia'
import type { Project } from '$lib/db/types'

export const load = (async (event) => {
	return {
		form: await superValidate({ active: true }, zod(formSchema), {
			errors: false,
		}),
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(formSchema))
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}

		const user = event.locals.user
		let project: Project | undefined = undefined
		const selected_project = event.params.project_id
		if (selected_project !== 'personal') {
			project = await db.query.project.findFirst({
				where: (project, { eq, and }) =>
					and(
						eq(project.userId, user.id),
						eq(project.id, selected_project),
					),
			})
		}

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
					and(eq(shortener.code, form.data.custom_code)),
				with: {
					project: true,
				},
			})

			for (const shortener of customCodeExist) {
				if (!shortener.project) {
					if (
						!project ||
						(project && !project.enable_custom_domain)
					) {
						return setError(
							form,
							'custom_code',
							'Duplicated Custom Code',
						)
					}
				} else {
					if (project) {
						if (
							!shortener.project.enable_custom_domain &&
							!project.enable_custom_domain
						) {
							return setError(
								form,
								'custom_code',
								'Duplicated Custom Code',
							)
						}

						if (
							shortener.project.custom_domain ===
							project.custom_domain
						) {
							return setError(
								form,
								'custom_code',
								'Duplicated Custom Code',
							)
						}
					} else {
						if (!shortener.project.enable_custom_domain) {
							return setError(
								form,
								'custom_code',
								'Duplicated Custom Code',
							)
						}
					}
				}
			}
		}

		const code = form.data.custom_code_enable
			? form.data.custom_code
			: nanoid(8)
		await db.insert(shortener).values({
			id: generateId(8),
			link: form.data.link,
			projectId:
				selected_project !== 'personal' ? selected_project : null,
			userId: user.id,
			code: code,
			ios: form.data.ios,
			ios_link: form.data.ios_link,
			android: form.data.android,
			android_link: form.data.android_link,
		})

		return { form }
	},
}
