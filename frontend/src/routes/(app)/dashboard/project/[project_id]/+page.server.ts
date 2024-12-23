import { db } from '$lib/db'
import { count, inArray } from 'drizzle-orm'
import type { PageServerLoad } from './$types'
import { visitor } from '$lib/db/schema'

export const load = (async (event) => {
	const { activeProjectId } = await event.parent()

	const user = event.locals.user

	const shorteners = await db.query.shortener.findMany({
		where: (shortenerTable, { eq, and, isNull }) =>
			and(
				eq(shortenerTable.userId, user.id),
				activeProjectId === 'personal'
					? isNull(shortenerTable.projectId)
					: eq(shortenerTable.projectId, activeProjectId),
			),
	})

	const visitorCount =
		shorteners.length > 0
			? await db
					.select({
						count: count(),
					})
					.from(visitor)
					.where(
						inArray(
							visitor.shortenerId,
							shorteners.map((shortener) => shortener.id),
						),
					)
			: [{ count: 0 }]

	return { visitorCount: visitorCount[0].count }
}) satisfies PageServerLoad
