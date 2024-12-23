import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const load = (async (event) => {
	redirect(302, '/dashboard/project/personal')
}) satisfies PageServerLoad

export const actions = {
	signout: async (event) => {
		console.log('signout')
		event.cookies.delete('token', { path: '/' })
		redirect(303, '/login')
	},
} satisfies Actions
