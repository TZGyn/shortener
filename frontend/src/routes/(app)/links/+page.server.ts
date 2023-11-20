import { db } from '$lib/db'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const user = event.locals.userObject

	const shorteners = await db.query.shortener.findMany({
		with: {
			visitor: true,
		},
		where: (shortener, { eq }) => eq(shortener.userId, user.id),
	})

	return { shorteners }
}) satisfies PageServerLoad
