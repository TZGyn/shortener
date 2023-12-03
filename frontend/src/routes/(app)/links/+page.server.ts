import { db } from '$lib/db'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const user = event.locals.userObject

	const shorteners = await db.query.shortener.findMany({
		with: {
			visitor: true,
		},
		where: (shortener, { eq, and, isNull }) =>
			and(eq(shortener.userId, user.id), isNull(shortener.projectId)),
	})

	return { shorteners }
}) satisfies PageServerLoad
