import { db } from '$lib/db'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const user = event.locals.userObject

	const project_uuid = event.url.searchParams.get('project')

	let project_id: number | undefined
	let selected_project: { value: null | string; label: string } = {
		value: null,
		label: 'None',
	}

	if (project_uuid) {
		try {
			const project = await db.query.project.findFirst({
				where: (project, { eq }) => eq(project.uuid, project_uuid),
			})
			project_id = project?.id
			if (project?.name) {
				selected_project.label = project.name
				selected_project.value = project.uuid
			}
		} catch (error) {
			project_id = undefined
		}
	}

	const shorteners = await db.query.shortener.findMany({
		with: {
			visitor: true,
			project: true,
		},
		where: (shortener, { eq, and, isNull }) =>
			and(
				eq(shortener.userId, user.id),
				project_id ? eq(shortener.projectId, project_id) : undefined,
			),
	})

	const projects = await db.query.project.findMany({
		where: (project, { eq }) => eq(project.userId, user.id),
	})

	const settings = await db.query.setting.findFirst({
		where: (settings, { eq }) => eq(settings.userId, user.id),
	})

	return { shorteners, projects, selected_project, settings }
}) satisfies PageServerLoad
