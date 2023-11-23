import { db } from '$lib/db'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { sql } from 'drizzle-orm'
import { visitor as visitorSchema } from '$lib/db/schema'

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

	const visitor = await db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			month: sql<number>`cast(to_char(${visitorSchema.createdAt}, 'MM') as int)`,
		})
		.from(visitorSchema)
		.groupBy(sql`to_char(${visitorSchema.createdAt}, 'MM')`)

	if (!shortener) {
		throw redirect(303, '/')
	}

	return { shortener, visitor }
}) satisfies PageServerLoad
