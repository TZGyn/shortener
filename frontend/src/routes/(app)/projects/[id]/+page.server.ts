import { db } from '$lib/db'
import {
	and,
	asc,
	desc,
	eq,
	getTableColumns,
	ilike,
	sql,
} from 'drizzle-orm'
import type { PageServerLoad } from './$types'
import { project, shortener, visitor } from '$lib/db/schema'

export const load = (async (event) => {
	const { project: selectedProject } = await event.parent()

	const user = event.locals.user

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
	const shorteners = db
		.select({
			...shortenerColumns,
			projectName: project.name,
			visitorCount: sql<number>`count(${visitor.id})`,
		})
		.from(shortener)
		.where(
			and(
				eq(shortener.userId, user.id),
				eq(shortener.projectId, selectedProject.id),
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
				eq(shortener.projectId, selectedProject.id),
				search
					? ilike(shortener.link, `%${decodeURI(search)}%`)
					: undefined,
			),
		)

	const projects = db.query.project.findMany({
		where: (project, { eq }) => eq(project.userId, user.id),
	})

	const settings = db.query.setting.findFirst({
		where: (settings, { eq }) => eq(settings.userId, user.id),
	})

	return {
		selectedProject,
		shorteners,
		projects: await projects,
		settings: await settings,
		page,
		perPage,
		search,
		sortBy,
		pagination,
	}
}) satisfies PageServerLoad
