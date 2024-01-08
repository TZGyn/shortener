import { db } from '$lib/db'
import { setting } from '$lib/db/schema'
import { qrUpdateSchema } from '$lib/server/types'
import { eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async (event) => {
	const body = await event.request.json()
	const qrUpdate = qrUpdateSchema.safeParse(body)
	const userId = event.locals.userObject.id

	if (!qrUpdate.success) {
		return new Response(JSON.stringify({ success: false }))
	}

	try {
		const settings = await db.query.setting.findFirst({
			where: (settingData, { eq }) => eq(settingData.userId, userId),
		})

		if (!settings) {
			await db.insert(setting).values({ userId })
		}
		await db
			.update(setting)
			.set(qrUpdate.data)
			.where(eq(setting.userId, userId))
		return new Response(JSON.stringify({ success: true }))
	} catch (error) {
		return new Response(JSON.stringify({ success: false }))
	}
}
