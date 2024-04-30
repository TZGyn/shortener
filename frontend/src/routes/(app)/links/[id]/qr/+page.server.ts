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
		redirect(300, `/links`)
	}

	const settings = await db.query.setting.findFirst({
		where: (settings, { eq }) => eq(settings.userId, user.id),
	})

	return { shortener, settings }
}) satisfies PageServerLoad
