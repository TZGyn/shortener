import { db } from '$lib/db'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const user = event.locals.userObject

	const project_uuid = event.url.searchParams.get('project')

	let project_id: number | undefined

	if (project_uuid) {
		try {
			const project = await db.query.project.findFirst({
				where: (project, { eq }) => eq(project.uuid, project_uuid),
			})
			project_id = project?.id
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
				project_id
					? eq(shortener.projectId, project_id)
					: isNull(shortener.projectId),
			),
	})

	const projects = await db.query.project.findMany({
		where: (project, { eq }) => eq(project.userId, user.id),
	})

	return { shorteners, projects }
}) satisfies PageServerLoad
