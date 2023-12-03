import { db } from '$lib/db'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const user = event.locals.userObject

	const projects = await db.query.project.findMany({
		with: {
			shortener: true,
		},
		where: (project, { eq }) => eq(project.userId, user.id),
	})

	return { projects }
}) satisfies PageServerLoad
