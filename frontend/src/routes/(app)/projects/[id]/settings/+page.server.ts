import { db } from '$lib/db'
import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { formSchema, deleteSchema } from './schema'
import { zod } from 'sveltekit-superforms/adapters'
import { project, shortener, visitor } from '$lib/db/schema'
import { and, eq } from 'drizzle-orm'

export const load = (async (event) => {
	const { project } = await event.parent()

	return {
		form: await superValidate(
			{
				name: project.name,
				qr_background: project.qr_background,
				qr_foreground: project.qr_foreground,
			},
			zod(formSchema),
		),
		deleteForm: await superValidate(
			{ deleteShorteners: true },
			zod(deleteSchema),
			{
				id: 'deleteProject',
			},
		),
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

		const userId = event.locals.user.id

		await db
			.update(project)
			.set({
				name: form.data.name,
				qr_background: form.data.qr_background,
				qr_foreground: form.data.qr_foreground,
			})
			.where(
				and(
					eq(project.uuid, event.params.id),
					eq(project.userId, userId),
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
				.delete(project)
				.where(
					and(
						eq(project.uuid, event.params.id),
						eq(project.userId, userId),
					),
				)
				.returning()

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
