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
import type { Project } from '$lib/db/types'

export const load = (async (event) => {
	const { project: selectedProject, activeProjectId } =
		await event.parent()
	const { linkid } = event.params

	const shortener = await db.query.shortener.findFirst({
		columns: {
			id: true,
			code: true,
			ios: true,
			ios_link: true,
			android: true,
			android_link: true,
			link: true,
			active: true,
		},
		where: (shortener, { eq, and, isNull }) =>
			and(
				eq(shortener.id, linkid),
				selectedProject
					? eq(shortener.projectId, selectedProject.id)
					: isNull(shortener.projectId),
			),
	})

	if (!shortener) {
		redirect(300, `/dashboard/projects/${activeProjectId}`)
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

		const { linkid } = event.params
		const user = event.locals.user

		let project: Project | undefined = undefined
		if (linkid !== 'personal') {
			project = await db.query.project.findFirst({
				where: (project, { eq, and }) =>
					and(eq(project.userId, user.id), eq(project.id, linkid)),
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
					and(
						eq(shortener.code, form.data.custom_code),
						ne(shortener.id, event.params.linkid),
					),
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
			.where(eq(shortener.id, event.params.linkid))

		return { form }
	},
}
