import { db } from '$lib/db'
import type { PageServerLoad } from './$types'

export const load = (async (event) => {
	const settings = await db.query.setting.findFirst({
		where: (setting, { eq }) =>
			eq(setting.userId, event.locals.userObject.id),
	})
	return { settings }
}) satisfies PageServerLoad
