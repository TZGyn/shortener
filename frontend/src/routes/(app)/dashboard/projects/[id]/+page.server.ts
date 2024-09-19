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
import { shortener, visitor } from '$lib/db/schema'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema } from './schema'
import type { Actions } from './$types'
import { nanoid } from 'nanoid'
import { isAlphanumeric } from '$lib/utils'
import { generateId } from 'lucia'

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
		.groupBy(shortener.id)
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

	return {
		selectedProject,
		shorteners,
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

			const customCodeExist = await db.query.shortener.findMany({
				where: (shortener, { eq, and, ne }) =>
					and(eq(shortener.code, form.data.custom_code)),
				with: {
					project: true,
				},
			})

			for (const shortener of customCodeExist) {
				if (!shortener.project && !project.enable_custom_domain) {
					return setError(
						form,
						'custom_code',
						'Duplicated Custom Code',
					)
				}

				if (!shortener.project) continue

				if (
					shortener.project.custom_domain === project.custom_domain
				) {
					return setError(
						form,
						'custom_code',
						'Duplicated Custom Code',
					)
				}
			}
		}

		const code = form.data.custom_code_enable
			? form.data.custom_code
			: nanoid(8)
		await db.insert(shortener).values({
			id: generateId(8),
			link: form.data.link,
			projectId: project.id,
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
