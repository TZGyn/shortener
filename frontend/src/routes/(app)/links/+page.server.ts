import { db } from '$lib/db'
import { sql } from 'drizzle-orm'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const user = event.locals.userObject

	const project_uuid = event.url.searchParams.get('project')
	const search = event.url.searchParams.get('search')
	let page = parseInt(event.url.searchParams.get('page') ?? '1')
	let perPage = parseInt(
		event.url.searchParams.get('perPage') ?? '10',
	)

	if (isNaN(page)) {
		page = 1
	}

	if (isNaN(perPage)) {
		perPage = 10
	}

	let project_id: number | undefined
	let selected_project: { value: null | string; label: string } = {
		value: null,
		label: 'All',
	}

	if (project_uuid) {
		try {
			const project = await db.query.project.findFirst({
				where: (project, { eq }) => eq(project.uuid, project_uuid),
			})
			project_id = project?.id
			if (project?.name) {
				selected_project.label = project.name
				selected_project.value = project.uuid
			}
		} catch (error) {
			project_id = undefined
		}
	}

	const shorteners = db.query.shortener.findMany({
		extras: {
			fullcount: sql<number>`count(*) over()`.as('fullcount'),
		},
		with: {
			visitor: true,
			project: true,
		},
		orderBy: (shortener, { desc }) => [desc(shortener.createdAt)],
		where: (shortener, { eq, and, ilike }) =>
			and(
				eq(shortener.userId, user.id),
				project_id ? eq(shortener.projectId, project_id) : undefined,
				search
					? ilike(shortener.link, `%${decodeURI(search)}%`)
					: undefined,
			),
		offset: perPage * (page - 1),
		limit: perPage,
	})

	const projects = db.query.project.findMany({
		where: (project, { eq }) => eq(project.userId, user.id),
	})

	const settings = db.query.setting.findFirst({
		where: (settings, { eq }) => eq(settings.userId, user.id),
	})

	return {
		shorteners,
		projects: await projects,
		selected_project,
		settings: await settings,
		page,
		perPage,
		search,
	}
}) satisfies PageServerLoad
