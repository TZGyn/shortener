import { db } from '$lib/db'
import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { formSchema } from './schema'
import { zod } from 'sveltekit-superforms/adapters'
import { setting } from '$lib/db/schema'
import { eq } from 'drizzle-orm'

export const load = (async (event) => {
	const settings = await db.query.setting.findFirst({
		where: (setting, { eq }) =>
			eq(setting.userId, event.locals.user.id),
	})

	const qr_background = settings?.qr_background || '#000'
	const qr_foreground = settings?.qr_foreground || '#fff'

	return {
		settings,
		form: await superValidate(
			{ qr_background, qr_foreground },
			zod(formSchema),
		),
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema))
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}

		const userId = event.locals.user.id
		const settings = await db.query.setting.findFirst({
			where: (settingData, { eq }) => eq(settingData.userId, userId),
		})

		if (!settings) {
			await db.insert(setting).values({ userId })
		}
		await db
			.update(setting)
			.set(form.data)
			.where(eq(setting.userId, userId))
		return {
			form,
		}
	},
}
