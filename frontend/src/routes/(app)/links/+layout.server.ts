import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const { breadcrumbs: parentBreadcrumbs } = await event.parent()

	const breadcrumbs = [
		...parentBreadcrumbs,
		{ name: 'Links', path: '/links' },
	]

	const page_title = 'Links'

	return { breadcrumbs, page_title }
}) satisfies LayoutServerLoad
