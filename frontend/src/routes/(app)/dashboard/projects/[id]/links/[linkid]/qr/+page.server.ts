import { db } from '$lib/db'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const { project: selectedProject } = await event.parent()
	const { linkid } = event.params

	const shortener = await db.query.shortener.findFirst({
		columns: {
			code: true,
		},
		where: (shortener, { eq, and }) =>
			and(
				eq(shortener.code, linkid),
				eq(shortener.projectId, selectedProject.id),
			),
	})

	if (!shortener) {
		redirect(300, `/dashboard/projects/${selectedProject.id}`)
	}

	return { shortener, project: selectedProject }
}) satisfies PageServerLoad
