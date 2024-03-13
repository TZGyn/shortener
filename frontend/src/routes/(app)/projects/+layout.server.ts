import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const { breadcrumbs: parentBreadcrumbs } = await event.parent()
	const breadcrumbs = [
		...parentBreadcrumbs,
		{ name: 'Projects', path: '/projects' },
	]
	return { breadcrumbs }
}) satisfies LayoutServerLoad
