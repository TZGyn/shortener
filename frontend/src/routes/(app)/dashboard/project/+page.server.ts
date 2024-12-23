import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { db } from '$lib/db'
import { project } from '$lib/db/schema'
import { generateId } from 'lucia'
import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema } from './[project_id]/(components)/schema'

export const load = (async (event) => {
	redirect(302, '/dashboard/project/personal')
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
			id: generateId(8),
			name: form.data.name,
			userId: user.id,
		})

		return message(form, 'Project created')
	},
}
