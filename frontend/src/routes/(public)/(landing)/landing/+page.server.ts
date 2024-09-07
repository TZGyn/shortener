import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	redirect(302, '/')
}) satisfies PageServerLoad
