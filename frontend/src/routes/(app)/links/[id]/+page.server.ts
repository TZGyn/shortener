import { db } from '$lib/db'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const user = event.locals.userObject
	const shortenerId = event.params.id

	const shortener = await db.query.shortener.findFirst({
		where: (shortener, { eq, and }) =>
			and(
				eq(shortener.code, shortenerId),
				eq(shortener.userId, user.id),
			),
		with: {
			visitor: true,
		},
	})

	if (!shortener) {
		throw redirect(303, '/')
	}

	return { shortener }
}) satisfies PageServerLoad
