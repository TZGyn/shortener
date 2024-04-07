import { lucia } from '$lib/server/auth'
import { redirect, type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName)

	const pathname = event.url.pathname

	const allowedPath = [
		'/login',
		'/signup',
		'/api/login',
		'/api/signup',
	]

	if (allowedPath.includes(pathname)) {
		if (sessionId) {
			redirect(303, '/')
		}
		event.locals.session = null
		const response = await resolve(event)

		return response
	}

	if (!sessionId) {
		redirect(303, '/login')
	}
	const { session, user } = await lucia.validateSession(sessionId)

	if (!user) {
		redirect(303, '/login')
	}

	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id)
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		})
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie()
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '/',
			...sessionCookie.attributes,
		})
	}

	event.locals.user = user
	event.locals.session = session

	const response = await resolve(event)

	return response
}
