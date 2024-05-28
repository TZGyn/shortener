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

	const shortenerColumns = getTableColumns(shortener)
	const shorteners = db
		.select({
			...shortenerColumns,
			projectName: project.name,
			projectUuid: project.uuid,
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
		sortBy,
		pagination,
		form: await superValidate({ active: true }, zod(formSchema)),
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

		if (form.data.link.startsWith('http://')) {
			return setError(form, 'link', 'Link must be HTTPS')
		}

		if (form.data.ios_link.startsWith('http://')) {
			return setError(form, 'ios_link', 'Link must be HTTPS')
		}

		if (form.data.android_link.startsWith('http://')) {
			return setError(form, 'android_link', 'Link must be HTTPS')
		}

		if (form.data.custom_code_enable) {
			if (!form.data.custom_code) {
				return setError(
					form,
					'custom_code',
					'Please Enter Custom Code',
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

		let ios_link = ''

		if (form.data.ios_link) {
			if (form.data.ios_link.startsWith('https://')) {
				ios_link = form.data.ios_link
			} else {
				ios_link = `https://${form.data.ios_link}`
			}
		}

		let android_link = ''

		if (form.data.android_link) {
			if (form.data.android_link.startsWith('https://')) {
				android_link = form.data.android_link
			} else {
				android_link = `https://${form.data.android_link}`
			}
		}

		const code = form.data.custom_code_enable
			? form.data.custom_code
			: nanoid(8)
		await db.insert(shortener).values({
			link: form.data.link.startsWith('https://')
				? form.data.link
				: `https://${form.data.link}`,
			projectId: project ? project.id : undefined,
			userId: user.id,
			code: code,
			ios: form.data.ios,
			ios_link: ios_link,
			android: form.data.android,
			android_link: android_link,
		})

		return { form }
	},
}
