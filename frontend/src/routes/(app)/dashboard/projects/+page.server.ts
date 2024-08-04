import { db } from '$lib/db'
import { message, superValidate } from 'sveltekit-superforms'
import type { PageServerLoad } from './$types'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema } from './schema'
import { fail, type Actions } from '@sveltejs/kit'
import { project } from '$lib/db/schema'

export const load = (async (event) => {
	const user = event.locals.user

	const projects = await db.query.project.findMany({
		with: {
			shortener: true,
		},
		where: (project, { eq }) => eq(project.userId, user.id),
	})

	return { projects, form: await superValidate(zod(formSchema)) }
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

		await db.insert(project).values({
			name: form.data.name,
			userId: user.id,
		})

		return message(form, 'Project created')
	},
}
