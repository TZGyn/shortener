import type { LayoutServerLoad } from './$types'
import { PUBLIC_SHORTENER_URL } from '$env/static/public'

export const load = (async (event) => {
	const user = event.locals.userObject

	return {
		shortener_url: process.env.PUBLIC_SHORTENER_URL ?? 's.tzgyn.com',
		user: user,
	}
}) satisfies LayoutServerLoad
