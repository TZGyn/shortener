import { db } from '$lib/db'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const uuid = event.params.uuid

	const user = event.locals.userObject

	try {
		const project = await db.query.project.findFirst({
			where: (project, { eq }) => eq(project.uuid, uuid),
		})

		if (!project) {
			throw redirect(303, '/projects')
		}

		const shorteners = await db.query.shortener.findMany({
			with: {
				visitor: true,
			},
			where: (shortener, { eq, and }) =>
				and(
					eq(shortener.userId, user.id),
					eq(shortener.projectId, project.id),
				),
		})

		return { project, shorteners }
	} catch (error) {
		throw redirect(303, '/projects')
	}
}) satisfies PageServerLoad
