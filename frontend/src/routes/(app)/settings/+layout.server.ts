import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const { breadcrumbs: parentBreadcrumbs } = await event.parent()
	const breadcrumbs = [
		...parentBreadcrumbs,
		{ name: 'Settings', path: '/settings' },
	]
	return { breadcrumbs }
}) satisfies LayoutServerLoad
