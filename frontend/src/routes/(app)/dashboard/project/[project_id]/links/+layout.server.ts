import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const {
		breadcrumbs: parentBreadcrumbs,
		activeProjectId,
		activeProjectName,
	} = await event.parent()

	const breadcrumbs = [
		...parentBreadcrumbs,
		{
			name: 'Links',
			path: `/dashboard/project/${activeProjectId}/links`,
		},
	]

	const page_title = `${activeProjectName} - Links`

	return { breadcrumbs, page_title }
}) satisfies LayoutServerLoad
