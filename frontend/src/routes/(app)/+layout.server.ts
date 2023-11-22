import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const user = event.locals.userObject

	return {
		shortener_url: process.env.PUBLIC_SHORTENER_URL ?? 's.tzgyn.com',
		user: user,
	}
}) satisfies LayoutServerLoad