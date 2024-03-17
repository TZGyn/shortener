import { db } from '$lib/db'
import { and, count, eq } from 'drizzle-orm'
import { shortener } from '$lib/db/schema'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const user = event.locals.userObject

	const project_uuid = event.url.searchParams.get('project')
	let page = parseInt(event.url.searchParams.get('page') ?? '1')
	let perPage = parseInt(
		event.url.searchParams.get('perPage') ?? '10',
	)

	if (isNaN(page)) {
		page = 1
	}

	if (isNaN(perPage)) {
		perPage = 20
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
		with: {
			visitor: true,
			project: true,
		},
		orderBy: (shortener, { desc }) => [desc(shortener.createdAt)],
		where: (shortener, { eq, and, isNull }) =>
			and(
				eq(shortener.userId, user.id),
				project_id ? eq(shortener.projectId, project_id) : undefined,
			),
		offset: perPage * (page - 1),
		limit: perPage,
	})

	const pagination = await db
		.select({ count: count() })
		.from(shortener)
		.where(
			and(
				eq(shortener.userId, user.id),
				project_id ? eq(shortener.projectId, project_id) : undefined,
			),
		)

	const projects = await db.query.project.findMany({
		where: (project, { eq }) => eq(project.userId, user.id),
	})

	const settings = await db.query.setting.findFirst({
		where: (settings, { eq }) => eq(settings.userId, user.id),
	})

	return {
		shorteners,
		projects,
		selected_project,
		settings,
		page,
		perPage,
		pagination: pagination[0],
	}
}) satisfies PageServerLoad
