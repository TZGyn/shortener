import { getUserFromSessionToken } from '$lib/server/auth'
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load = (async (event) => {
	const token = event.cookies.get('token')

	if (!token) {
		throw redirect(303, '/')
	}

	const user = await getUserFromSessionToken(token)

	if (!user) {
		throw redirect(303, '/')
	}

	return {
		shortener_url: process.env.SHORTENER_URL ?? 's.tzgyn.com',
		user: user,
	}
}) satisfies LayoutServerLoad
