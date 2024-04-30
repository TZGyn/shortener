import type { PageServerLoad } from './$types'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema } from './schema'
import type { Actions } from './$types'
import { db } from '$lib/db'
import { redirect } from '@sveltejs/kit'
import { shortener } from '$lib/db/schema'
import { eq } from 'drizzle-orm'

export const load = (async (event) => {
	const user = event.locals.user
	const { id } = event.params

	const shortener = await db.query.shortener.findFirst({
		columns: {
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
		redirect(300, `/links`)
	}

	const projects = await db.query.project.findMany({
		where: (project, { eq }) => eq(project.userId, user.id),
	})

	let selectedCategory = undefined
	if (shortener.projectId) {
		const project = projects.find(
			(project) => project.id === shortener.projectId,
		)
		if (project) {
			selectedCategory = { value: project.uuid, label: project.name }
		}
	}

	return {
		projects,
		selectedCategory,
		form: await superValidate(
			{
				...shortener,
				project: selectedCategory?.value || undefined,
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

		if (form.data.link.startsWith('http://')) {
			return setError(form, 'link', 'Link must be HTTPS')
		}

		if (
			form.data.ios_link &&
			form.data.ios_link.startsWith('http://')
		) {
			return setError(form, 'ios_link', 'Link must be HTTPS')
		}

		if (
			form.data.android_link &&
			form.data.android_link.startsWith('http://')
		) {
			return setError(form, 'android_link', 'Link must be HTTPS')
		}

		const user = event.locals.user

		let project = undefined
		const selected_project = form.data.project
		if (selected_project) {
			project = await db.query.project.findFirst({
				where: (project, { eq, and }) =>
					and(
						eq(project.userId, user.id),
						eq(project.uuid, selected_project),
					),
			})
		}

		let ios_link = ''

		if (form.data.ios_link) {
			if (form.data.ios_link.startsWith('https://')) {
				ios_link = form.data.ios_link
			} else {
				ios_link = `https://${form.data.ios_link}`
			}
		}

		let android_link = ''

		if (form.data.android_link) {
			if (form.data.android_link.startsWith('https://')) {
				android_link = form.data.android_link
			} else {
				android_link = `https://${form.data.android_link}`
			}
		}

		await db
			.update(shortener)
			.set({
				link: form.data.link.startsWith('https://')
					? form.data.link
					: `https://${form.data.link}`,
				projectId: project ? project.id : null,
				userId: user.id,
				ios: form.data.ios,
				ios_link: ios_link,
				android: form.data.android,
				android_link: android_link,
			})
			.where(eq(shortener.code, event.params.id))

		return { form }
	},
}
