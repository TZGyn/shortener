import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const user = event.locals.userObject

	const breadcrumbs = [{ name: 'Home', path: '/' }]

	return {
		shortener_url:
			process.env.PUBLIC_SHORTENER_URL ?? '3000.tzgyn.com',
		user: user,
		breadcrumbs,
	}
}) satisfies LayoutServerLoad
