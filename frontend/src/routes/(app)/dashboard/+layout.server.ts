import { env } from '$env/dynamic/public'
import { db } from '$lib/db'
import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const user = event.locals.user

	const projects = await db.query.project.findMany({
		where: (project, { eq }) => eq(project.userId, user.id),
	})

	const breadcrumbs = [{ name: 'Home', path: '/dashboard' }]

	const page_title = 'Home'

	return {
		shortener_url: env.PUBLIC_SHORTENER_URL,
		user: user,
		breadcrumbs,
		page_title,
		projects,
	}
}) satisfies LayoutServerLoad
