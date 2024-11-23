import { db } from '$lib/db'
import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate, withFiles } from 'sveltekit-superforms'
import { formSchema } from './schema'
import { zod } from 'sveltekit-superforms/adapters'
import { eq } from 'drizzle-orm'
import { user as userTable } from '$lib/db/schema'

export const load = (async (event) => {
	const user = event.locals.user

	const qr_background = user.qrBackground
	const qr_foreground = user.qrForeground

	return {
		qrImageBase64: user.qrImageBase64,
		form: await superValidate(
			{
				qr_background,
				qr_foreground,
				qrCornerSquareStyle: user.qrCornerSquareStyle,
				qrDotStyle: user.qrDotStyle,
			},
			zod(formSchema),
			{ errors: false },
		),
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	default: async (event) => {
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
		const userId = event.locals.user.id

		const {
			qr_background,
			qr_foreground,
			qrCornerSquareStyle,
			qrDotStyle,
			qrImage,
		} = form.data

		const qrImageType = qrImage ? qrImage.type : undefined
		const qrImageBlob = qrImage
			? await qrImage.arrayBuffer()
			: undefined
		const qrImageBase64 = qrImageBlob
			? Buffer.from(qrImageBlob).toString('base64')
			: undefined

		await db
			.update(userTable)
			.set({
				qrBackground: qr_background,
				qrForeground: qr_foreground,
			})
			.where(eq(userTable.id, userId))

		if (user.plan !== 'free') {
			await db
				.update(userTable)
				.set({
					qrCornerSquareStyle,
					qrDotStyle,
					qrImageBase64: qrImage
						? `data:${qrImageType};base64,${qrImageBase64}`
						: undefined,
				})
				.where(eq(userTable.id, userId))
		}

		return withFiles({
			form,
		})
	},
}
