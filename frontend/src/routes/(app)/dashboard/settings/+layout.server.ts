import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const { breadcrumbs: parentBreadcrumbs } = await event.parent()

	const breadcrumbs = [
		...parentBreadcrumbs,
		{ name: 'Settings', path: '/dashboard/settings' },
	]

	const page_title = 'Settings'

	return { breadcrumbs, page_title }
}) satisfies LayoutServerLoad
