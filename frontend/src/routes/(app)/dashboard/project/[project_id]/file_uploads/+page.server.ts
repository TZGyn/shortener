import type { PageServerLoad } from './$types'
import { db } from '$lib/db'

export const load = (async (event) => {
	const user = event.locals.user

	const { activeProjectId, breadcrumbs: parentBreadcrumbs } =
		await event.parent()

	const breadcrumbs = [
		...parentBreadcrumbs,
		{
			name: 'Files',
			path: `/dashboard/project/${activeProjectId}/file_uploads`,
		},
	]

	const files = db.query.file.findMany({
		where: (file, { and, eq, isNull }) =>
			and(
				eq(file.userId, user.id),
				activeProjectId !== 'personal'
					? eq(file.projectId, activeProjectId)
					: isNull(file.projectId),
			),
		with: {
			shortener: true,
		},
	})

	return {
		files,
		breadcrumbs,
	}
}) satisfies PageServerLoad
