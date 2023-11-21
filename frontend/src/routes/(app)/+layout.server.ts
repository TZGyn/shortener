import type { LayoutServerLoad } from './$types'
import { PUBLIC_SHORTENER_URL } from '$env/static/public'

export const load = (async (event) => {
	const user = event.locals.userObject

	return {
		shortener_url: PUBLIC_SHORTENER_URL,
		user: user,
	}
}) satisfies LayoutServerLoad
