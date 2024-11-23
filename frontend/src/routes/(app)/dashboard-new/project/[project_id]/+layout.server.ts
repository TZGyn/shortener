import { env } from '$env/dynamic/public'
import { db } from '$lib/db'
import type { LayoutServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema } from './(components)/schema'

export const load = (async (event) => {
	const user = event.locals.user

	const projects = await db.query.project.findMany({
		where: (project, { eq }) => eq(project.userId, user.id),
	})

	const projectId = event.params.project_id

	const activeProject =
		projectId !== 'personal'
			? await db.query.project.findFirst({
					where: (projectTable, { eq, and }) =>
						and(
							eq(projectTable.userId, user.id),
							eq(projectTable.id, event.params.project_id),
						),
			  })
			: undefined

	const breadcrumbs = [
		{
			name: activeProject?.name || 'Personal',
			path: activeProject
				? `/dashboard-new/project/${activeProject.id}`
				: '/dashboard-new/project/personal',
		},
	]

	const page_title = activeProject?.name || 'Personal'

	return {
		shortener_url: env.PUBLIC_SHORTENER_URL,
		user: user,
		breadcrumbs,
		page_title,
		projects,
		activeProject,
		project: activeProject,
		activeProjectName: activeProject?.name || 'Personal',
		activeProjectId: activeProject?.id || 'personal',
		form: await superValidate(zod(formSchema)),
	}
}) satisfies LayoutServerLoad
