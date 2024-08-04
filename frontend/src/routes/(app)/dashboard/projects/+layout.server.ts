import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const { breadcrumbs: parentBreadcrumbs } = await event.parent()
	const breadcrumbs = [
		...parentBreadcrumbs,
		{ name: 'Projects', path: '/dashboard/projects' },
	]
	const page_title = 'Projects'
	return { breadcrumbs, page_title }
}) satisfies LayoutServerLoad
