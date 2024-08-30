import { db } from '$lib/db'
import type { PageServerLoad, Actions } from './$types'
import {
	message,
	setError,
	setMessage,
	superValidate,
	fail,
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

export const load = (async (event) => {
	const { project } = await event.parent()

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
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	update: async (event) => {
		const form = await superValidate(event, zod(formSchema))
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}
		const user = event.locals.user

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
			})
			.where(
				and(
					eq(projectTable.uuid, event.params.id),
					eq(projectTable.userId, user.id),
				),
			)

		return {
			form,
		}
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
					eq(projectTable.uuid, event.params.id),
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
						ne(projectTable.uuid, event.params.id),
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
					eq(projectTable.uuid, event.params.id),
					eq(projectTable.userId, userId),
				),
			)

		return setMessage(form, 'Custom Domain Enabled')
	},
	disable_custom_domain: async (event) => {
		const userId = event.locals.user.id

		const existingProject = await db.query.project.findFirst({
			where: (projectTable, { eq, and }) =>
				and(
					eq(projectTable.uuid, event.params.id),
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
					eq(projectTable.uuid, event.params.id),
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
					eq(projectTable.uuid, event.params.id),
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
						ne(projectTable.uuid, event.params.id),
						eq(projectTable.custom_domain, form.data.domain),
					),
			})

		if (sameDomainDifferentProject) {
			return setError(form, 'domain', 'Domain already taken')
		}

		const sameDomainSameProject = await db.query.project.findFirst({
			where: (projectTable, { eq, and }) =>
				and(
					eq(projectTable.uuid, event.params.id),
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
					eq(projectTable.uuid, event.params.id),
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
						eq(projectTable.uuid, event.params.id),
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
