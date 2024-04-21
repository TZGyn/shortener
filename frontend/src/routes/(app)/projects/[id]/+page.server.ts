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

		const { id } = event.params
		const user = event.locals.user
		const project = await db.query.project.findFirst({
			where: (project, { eq, and }) =>
				and(eq(project.userId, user.id), eq(project.uuid, id)),
		})

		if (!project) {
			return fail(400, {
				form,
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

		const code = nanoid(8)
		await db.insert(shortener).values({
			link: form.data.link.startsWith('https://')
				? form.data.link
				: `https://${form.data.link}`,
			projectId: project.id,
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
