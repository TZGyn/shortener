import { env } from '$lib/env'
import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const user = event.locals.user

	const breadcrumbs = [{ name: 'Home', path: '/' }]

	return {
		shortener_url: env.PUBLIC_SHORTENER_URL,
		user: user,
		breadcrumbs,
	}
}) satisfies LayoutServerLoad
