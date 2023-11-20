import { db } from '$lib/db'
import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(303, '/')
	}

	const userId = event.locals.user

	const shorteners = await db.query.shortener.findMany({
		with: {
			visitor: true,
		},
		where: (shortener, { eq }) => eq(shortener.userId, userId),
	})

	return { shorteners }
}) satisfies PageServerLoad
