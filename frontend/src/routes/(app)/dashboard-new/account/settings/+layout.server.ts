import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const breadcrumbs = [
		{ name: 'Settings', path: '/dashboard/settings' },
	]

	const page_title = 'Settings'

	return { breadcrumbs, page_title }
}) satisfies LayoutServerLoad
