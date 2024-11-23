import { db } from '$lib/db'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const { activeProjectId } = await event.parent()
	const { linkid } = event.params

	const shortener = await db.query.shortener.findFirst({
		columns: {
			code: true,
		},
		where: (shortener, { eq, and }) => eq(shortener.id, linkid),
	})

	if (!shortener) {
		redirect(300, `/dashboard/projects/${activeProjectId}`)
	}

	return { shortener }
}) satisfies PageServerLoad
