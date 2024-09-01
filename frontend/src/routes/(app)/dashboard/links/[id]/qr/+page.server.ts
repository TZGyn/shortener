import { db } from '$lib/db'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const user = event.locals.user
	const { id } = event.params

	const shortener = await db.query.shortener.findFirst({
		columns: {
			code: true,
		},
		where: (shortener, { eq, and, isNull }) =>
			and(eq(shortener.code, id), isNull(shortener.projectId)),
	})

	if (!shortener) {
		redirect(300, `/dashboard/links`)
	}

	return { shortener }
}) satisfies PageServerLoad
