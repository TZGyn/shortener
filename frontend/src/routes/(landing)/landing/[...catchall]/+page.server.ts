import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load = (async () => {
	return redirect(300, '/landing')
}) satisfies PageServerLoad
