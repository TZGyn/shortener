import { authenticateUser } from '$lib/server/auth'
import { redirect, type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = await authenticateUser(event)

	const pathname = event.url.pathname

	if (pathname === '/login' || pathname === 'signup') {
		if (event.locals.user) {
			throw redirect(303, '/')
		}
	}

	if (pathname !== '/login' && pathname !== '/signup') {
		if (!event.locals.user) {
			throw redirect(303, '/login')
		}
	}

	const response = await resolve(event)

	return response
}
