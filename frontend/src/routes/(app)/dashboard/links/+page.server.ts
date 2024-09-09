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
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema } from './schema'
import type { Actions } from './$types'
import { nanoid } from 'nanoid'
import { isAlphanumeric } from '$lib/utils'
import { generateId } from 'lucia'

export const load = (async (event) => {
	const user = event.locals.user

	const project_uuid = event.url.searchParams.get('project')
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

	let project_id: string | undefined
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
				project_id ? eq(shortener.projectId, project_id) : undefined,
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

	const pagination = db
		.select({
			total: sql<number>`count(*)`.as('total'),
		})
		.from(shortener)
		.where(
			and(
				eq(shortener.userId, user.id),
				project_id ? eq(shortener.projectId, project_id) : undefined,
				search
					? ilike(shortener.link, `%${decodeURI(search)}%`)
					: undefined,
			),
		)

	if (sortBy === 'latest') {
		shorteners.orderBy(desc(shortener.createdAt))
	} else if (sortBy === 'oldest') {
		shorteners.orderBy(asc(shortener.createdAt))
	} else if (sortBy === 'most_visited') {
		shorteners.orderBy(sql`count(${visitor.id}) desc`)
	}

	const projects = db.query.project.findMany({
		where: (project, { eq }) => eq(project.userId, user.id),
	})

	return {
		shorteners,
		projects: await projects,
		selected_project,
		page,
		perPage,
		search,
		sortBy,
		pagination,
		form: await superValidate({ active: true }, zod(formSchema), {
			errors: false,
		}),
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(formSchema))
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}

		if (form.data.custom_code_enable) {
			if (!form.data.custom_code) {
				return setError(
					form,
					'custom_code',
					'Please Enter Custom Code',
				)
			}
			if (!isAlphanumeric(form.data.custom_code)) {
				return setError(
					form,
					'custom_code',
					'Code cannot contain special characters',
				)
			}

			const customCodeExist = await db.query.shortener.findFirst({
				where: (shortener, { eq }) =>
					eq(shortener.code, form.data.custom_code),
			})

			if (customCodeExist) {
				return setError(form, 'custom_code', 'Duplicated Custom Code')
			}
		}

		const user = event.locals.user
		let project = undefined
		const selected_project = form.data.project
		if (selected_project) {
			project = await db.query.project.findFirst({
				where: (project, { eq, and }) =>
					and(
						eq(project.userId, user.id),
						eq(project.uuid, selected_project),
					),
			})
		}

		const code = form.data.custom_code_enable
			? form.data.custom_code
			: nanoid(8)
		await db.insert(shortener).values({
			id: generateId(8),
			link: form.data.link,
			projectId: project?.id,
			userId: user.id,
			code: code,
			ios: form.data.ios,
			ios_link: form.data.ios_link,
			android: form.data.android,
			android_link: form.data.android_link,
		})

		return { form }
	},
}
