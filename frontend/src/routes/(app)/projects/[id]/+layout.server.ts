import { db } from '$lib/db'
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const { id } = event.params
	try {
		const user = event.locals.user
		const project = await db.query.project.findFirst({
			where: (project, { eq, and }) =>
				and(eq(project.userId, user.id), eq(project.uuid, id)),
		})

		if (!project) {
			redirect(300, '/projects')
		}

		const { breadcrumbs: parentBreadcrumbs } = await event.parent()
		const breadcrumbs = [
			...parentBreadcrumbs,
			{ name: project.name, path: `/projects/${project.uuid}` },
		]
		return { breadcrumbs, project }
	} catch (e) {
		redirect(300, '/projects')
	}
}) satisfies LayoutServerLoad
