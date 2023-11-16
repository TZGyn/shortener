import { db } from '$lib/db'
import { shortener } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(303, '/')
	}

	const userId = event.locals.user

	const shorteners = await db
		.select()
		.from(shortener)
		.where(eq(shortener.userId, userId))

	return { shorteners }
}) satisfies PageServerLoad
