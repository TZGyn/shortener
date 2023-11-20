import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const load = (async () => {
	return {}
}) satisfies PageServerLoad

export const actions = {
	signout: async (event) => {
		console.log('signout')
		event.cookies.delete('token')
		throw redirect(303, '/login')
	},
} satisfies Actions
