import { db } from '$lib/db'
import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { formSchema } from './schema'
import { zod } from 'sveltekit-superforms/adapters'
import { setting } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import { user as userTable } from '$lib/db/schema'

export const load = (async (event) => {
	const user = event.locals.user
	const settings = await db.query.setting.findFirst({
		where: (setting, { eq }) =>
			eq(setting.userId, event.locals.user.id),
	})

	const qr_background = settings?.qr_background || '#000'
	const qr_foreground = settings?.qr_foreground || '#fff'

	return {
		settings,
		form: await superValidate(
			{
				qr_background,
				qr_foreground,
				qrCornerSquareStyle: user.qrCornerSquareStyle,
				qrDotStyle: user.qrDotStyle,
			},
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

		const user = event.locals.user
		const userId = event.locals.user.id
		const settings = await db.query.setting.findFirst({
			where: (settingData, { eq }) => eq(settingData.userId, userId),
		})

		if (!settings) {
			await db.insert(setting).values({ userId })
		}

		const {
			qr_background,
			qr_foreground,
			qrCornerSquareStyle,
			qrDotStyle,
		} = form.data
		await db
			.update(setting)
			.set({ qr_background, qr_foreground })
			.where(eq(setting.userId, userId))

		if (user.plan !== 'free') {
			await db
				.update(userTable)
				.set({ qrCornerSquareStyle, qrDotStyle })
		}

		return {
			form,
		}
	},
}
