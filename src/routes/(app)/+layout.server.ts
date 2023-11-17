import type { LayoutServerLoad } from './$types'

export const load = (async () => {
	return {
		shortener_url: process.env.SHORTENER_URL ?? 's.tzgyn.com',
	}
}) satisfies LayoutServerLoad
