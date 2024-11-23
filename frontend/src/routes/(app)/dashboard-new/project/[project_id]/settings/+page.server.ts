import { db } from '$lib/db'
import type { PageServerLoad, Actions } from './$types'
import {
	message,
	setError,
	setMessage,
	superValidate,
	fail,
	withFiles,
} from 'sveltekit-superforms'
import {
	formSchema,
	deleteSchema,
	customDomainFormSchema,
	enableCustomDomainFormSchema,
} from './schema'
import { zod } from 'sveltekit-superforms/adapters'
import {
	project as projectTable,
	shortener,
	visitor,
} from '$lib/db/schema'
import { and, eq } from 'drizzle-orm'
import {
	checkDomainAvailable,
	createCustomDomain,
	deleteCustomDomain,
} from '$lib/server/domain'
import { env } from '$env/dynamic/private'
import { redirect } from '@sveltejs/kit'

export const load = (async (event) => {
	const {
		breadcrumbs: parentBreadcrumbs,
		project,
		activeProjectId,
		activeProjectName,
	} = await event.parent()

	if (!project) redirect(302, '/dashboard-new/project')

	const breadcrumbs = [
		...parentBreadcrumbs,
		{
			name: 'Settings',
			path: `/dashboard-new/project/${activeProjectId}/settings`,
		},
	]

	const page_title = `${activeProjectName} - Settings`

	let cnameRecord = ''
	let aRecord = ''
	let aaaaRecord = ''

	const provider = env.PRIVATE_HOSTING_PROVIDER

	if (provider === 'fly.io') {
		cnameRecord = env.PRIVATE_FLYIO_CNAME
		aRecord = env.PRIVATE_FLYIO_IPV4
		aaaaRecord = env.PRIVATE_FLYIO_IPV6
	} else if (provider === 'railway') {
	} else {
		aRecord = env.PUBLIC_SHORTENER_IP || ''
	}

	return {
		form: await superValidate(
			{
				name: project.name,
				qr_background: project.qr_background,
				qr_foreground: project.qr_foreground,
				qrCornerSquareStyle: project.qrCornerSquareStyle,
				qrDotStyle: project.qrDotStyle,
			},
			zod(formSchema),
		),
		qrImageBase64: project.qrImageBase64,
		enableCustomDomainForm: await superValidate(
			{ enableDomain: project.custom_domain || '' },
			zod(enableCustomDomainFormSchema),
		),
		customDomainForm: await superValidate(
			{ domain: project.custom_domain || '' },
			zod(customDomainFormSchema),
		),
		deleteForm: await superValidate(
			{ deleteShorteners: true },
			zod(deleteSchema),
			{
				id: 'deleteProject',
			},
		),
		cnameRecord,
		aRecord,
		aaaaRecord,
		breadcrumbs,
		page_title,
		project,
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	update: async (event) => {
		const form = await superValidate(event, zod(formSchema))
		if (!form.valid) {
			return fail(
				400,
				withFiles({
					form,
				}),
			)
		}
		const user = event.locals.user

		const qrImage = form.data.qrImage

		const qrImageType = qrImage ? qrImage.type : undefined
		const qrImageBlob = qrImage
			? await qrImage.arrayBuffer()
			: undefined
		const qrImageBase64 = qrImageBlob
			? Buffer.from(qrImageBlob).toString('base64')
			: undefined

		await db
			.update(projectTable)
			.set({
				name: form.data.name,
				qr_background: form.data.qr_background,
				qr_foreground: form.data.qr_foreground,
				qrCornerSquareStyle:
					user.plan !== 'free'
						? form.data.qrCornerSquareStyle
						: undefined,
				qrDotStyle:
					user.plan !== 'free' ? form.data.qrDotStyle : undefined,
				qrImageBase64:
					user.plan !== 'free'
						? qrImage
							? `data:${qrImageType};base64,${qrImageBase64}`
							: undefined
						: undefined,
			})
			.where(
				and(
					eq(projectTable.id, event.params.project_id),
					eq(projectTable.userId, user.id),
				),
			)

		return withFiles({
			form,
		})
	},
	enable_custom_domain: async (event) => {
		const form = await superValidate(
			event,
			zod(enableCustomDomainFormSchema),
		)
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}

		if (form.data.enableDomain === '') {
			return setError(form, 'enableDomain', 'domain cannot be empty')
		}

		const userId = event.locals.user.id

		if (
			!event.locals.user.email_verified &&
			env.PRIVATE_MAIL_PROVIDER &&
			env.PRIVATE_MAIL_PROVIDER !== ''
		) {
			return setError(
				form,
				'enableDomain',
				'Please verify your email account',
			)
		}

		if (event.locals.user.plan === 'free') {
			return setError(
				form,
				'enableDomain',
				'Please upgrade your account to pro plan to use this feature',
			)
		}

		if (event.locals.user.plan === 'pro') {
			const projectsWithEnabledDomains =
				await db.query.project.findMany({
					where: (projectTable, { eq, and }) =>
						and(
							eq(projectTable.userId, userId),
							eq(projectTable.enable_custom_domain, true),
						),
				})

			if (projectsWithEnabledDomains.length >= 5) {
				return setError(
					form,
					'enableDomain',
					'You are only allowed to use maximum 5 custom domains in pro plan',
				)
			}
		}

		const existingProject = await db.query.project.findFirst({
			where: (projectTable, { eq, and }) =>
				and(
					eq(projectTable.id, event.params.project_id),
					eq(projectTable.userId, userId),
				),
		})

		if (!existingProject) {
			return fail(400, { message: 'Project not found' })
		}

		const sameDomainDifferentProject =
			await db.query.project.findFirst({
				where: (projectTable, { eq, and, ne }) =>
					and(
						ne(projectTable.id, event.params.project_id),
						eq(projectTable.custom_domain, form.data.enableDomain),
					),
			})

		if (sameDomainDifferentProject) {
			return setError(form, 'enableDomain', 'Domain already taken')
		}

		const domainAvailable = await checkDomainAvailable(
			form.data.enableDomain,
		)

		if (!domainAvailable) {
			return setError(form, 'enableDomain', 'Domain is not available')
		}

		const customDomain = await createCustomDomain(
			form.data.enableDomain,
		)

		if (!customDomain.success) {
			return setError(
				form,
				'enableDomain',
				'Cannot create custom domain',
			)
		}

		await db
			.update(projectTable)
			.set({
				custom_domain: form.data.enableDomain,
				custom_domain_id: customDomain.id,
				custom_ip: customDomain.ip,
				enable_custom_domain: true,
			})
			.where(
				and(
					eq(projectTable.id, event.params.project_id),
					eq(projectTable.userId, userId),
				),
			)

		return setMessage(form, 'Custom Domain Enabled')
	},
	disable_custom_domain: async (event) => {
		return { message: 'Disabling custom domain is unavailable' }
		const userId = event.locals.user.id

		const existingProject = await db.query.project.findFirst({
			where: (projectTable, { eq, and }) =>
				and(
					eq(projectTable.uuid, event.params.project_id),
					eq(projectTable.userId, userId),
				),
		})

		if (!existingProject) {
			return fail(400, { message: 'Project not found' })
		}

		const deleteOldCustomDomain = await deleteCustomDomain(
			existingProject.custom_domain_id,
		)

		if (!deleteOldCustomDomain.success) {
			return { message: 'Cannot delete old custom domain' }
		}

		await db
			.update(projectTable)
			.set({
				enable_custom_domain: false,
			})
			.where(
				and(
					eq(projectTable.uuid, event.params.project_id),
					eq(projectTable.userId, userId),
				),
			)

		return { message: 'Custom domain disabled' }
	},
	update_custom_domain: async (event) => {
		const form = await superValidate(
			event,
			zod(customDomainFormSchema),
		)
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}

		const userId = event.locals.user.id

		const existingProject = await db.query.project.findFirst({
			where: (projectTable, { eq, and }) =>
				and(
					eq(projectTable.id, event.params.project_id),
					eq(projectTable.userId, userId),
				),
		})

		if (!existingProject || !existingProject.enable_custom_domain) {
			return fail(400, {
				form,
			})
		}

		const sameDomainDifferentProject =
			await db.query.project.findFirst({
				where: (projectTable, { eq, and, ne }) =>
					and(
						ne(projectTable.id, event.params.project_id),
						eq(projectTable.custom_domain, form.data.domain),
					),
			})

		if (sameDomainDifferentProject) {
			return setError(form, 'domain', 'Domain already taken')
		}

		const sameDomainSameProject = await db.query.project.findFirst({
			where: (projectTable, { eq, and }) =>
				and(
					eq(projectTable.id, event.params.project_id),
					eq(projectTable.custom_domain, form.data.domain),
				),
		})

		if (sameDomainSameProject) {
			return { form }
		}

		const domainAvailable = await checkDomainAvailable(
			form.data.domain,
		)

		if (!domainAvailable) {
			return setError(form, 'domain', 'Domain is not available')
		}

		const customDomain = await createCustomDomain(form.data.domain)

		if (!customDomain.success) {
			return setError(form, 'domain', 'Cannot create custom domain')
		}

		const deleteOldCustomDomain = await deleteCustomDomain(
			existingProject.custom_domain_id,
		)

		if (!deleteOldCustomDomain.success) {
			return setError(
				form,
				'domain',
				'Cannot delete old custom domain',
			)
		}

		await db
			.update(projectTable)
			.set({
				custom_domain: form.data.domain,
				custom_domain_id: customDomain.id,
				custom_ip: customDomain.ip,
			})
			.where(
				and(
					eq(projectTable.id, event.params.project_id),
					eq(projectTable.userId, userId),
				),
			)

		return {
			form,
		}
	},
	delete: async (event) => {
		const userId = event.locals.user.id

		const form = await superValidate(event, zod(deleteSchema))

		if (!form.valid) {
			return fail(400, {
				form,
			})
		}

		try {
			const deletedProject = await db
				.delete(projectTable)
				.where(
					and(
						eq(projectTable.id, event.params.project_id),
						eq(projectTable.userId, userId),
					),
				)
				.returning()

			await deleteCustomDomain(deletedProject[0].custom_domain_id)

			if (form.data.deleteShorteners) {
				const deletedShorteners = await db
					.delete(shortener)
					.where(
						and(
							eq(shortener.projectId, deletedProject[0].id),
							eq(shortener.userId, userId),
						),
					)
					.returning()
				deletedShorteners.map(async (shortener) => {
					await db
						.delete(visitor)
						.where(eq(visitor.shortenerId, shortener.id))
				})
			} else {
				await db
					.update(shortener)
					.set({ projectId: null })
					.where(
						and(
							eq(shortener.projectId, deletedProject[0].id),
							eq(shortener.userId, userId),
						),
					)
			}

			return {
				form,
			}
		} catch (error) {
			return fail(400, {
				form,
			})
		}
	},
}
