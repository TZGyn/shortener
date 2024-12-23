import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	redirect(300, '/dashboard/account/settings/account')
}) satisfies PageServerLoad
