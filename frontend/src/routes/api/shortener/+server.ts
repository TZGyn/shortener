import { project, shortener, visitor } from '$lib/db/schema'
import {
	and,
	asc,
	desc,
	eq,
	getTableColumns,
	ilike,
	sql,
} from 'drizzle-orm'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'

export const GET: RequestHandler = async (event) => {
	const user = event.locals.user

	const project_id = event.url.searchParams.get('project')
	const search = event.url.searchParams.get('search')
	let sortBy = event.url.searchParams.get('sortBy')
	let page = parseInt(event.url.searchParams.get('page') ?? '1')
	let perPage = parseInt(
		event.url.searchParams.get('perPage') ?? '12',
	)

	if (isNaN(page)) {
		page = 1
	}

	if (isNaN(perPage)) {
		perPage = 10
	}

	if (
		sortBy !== 'latest' &&
		sortBy !== 'oldest' &&
		sortBy !== 'most_visited'
	) {
		sortBy = 'latest'
	}

	const shortenerColumns = getTableColumns(shortener)
	const projectColumns = getTableColumns(project)

	const shorteners = db
		.select({
			...shortenerColumns,
			projectName: project.name,
			projectUuid: project.uuid,
			project: { ...projectColumns },
			visitorCount: sql<number>`count(${visitor.id})`,
		})
		.from(shortener)
		.where(
			and(
				eq(shortener.userId, user.id),
				project_id && project_id !== 'all'
					? eq(shortener.projectId, project_id)
					: undefined,
				search
					? ilike(shortener.link, `%${decodeURI(search)}%`)
					: undefined,
			),
		)
		.leftJoin(visitor, eq(shortener.id, visitor.shortenerId))
		.leftJoin(project, eq(shortener.projectId, project.id))
		.groupBy(shortener.id, project.id)
		.offset(perPage * (page - 1))
		.limit(perPage)

	if (sortBy === 'latest') {
		shorteners.orderBy(desc(shortener.createdAt))
	} else if (sortBy === 'oldest') {
		shorteners.orderBy(asc(shortener.createdAt))
	} else if (sortBy === 'most_visited') {
		shorteners.orderBy(sql`count(${visitor.id}) desc`)
	}

	const pagination = db
		.select({
			total: sql<number>`count(*)`.as('total'),
		})
		.from(shortener)
		.where(
			and(
				eq(shortener.userId, user.id),
				project_id && project_id !== 'all'
					? eq(shortener.projectId, project_id)
					: undefined,
				search
					? ilike(shortener.link, `%${decodeURI(search)}%`)
					: undefined,
			),
		)

	return Response.json({
		success: true,
		shorteners: await shorteners,
		pagination: (await pagination)[0],
	})
}
