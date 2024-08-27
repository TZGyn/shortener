import { lucia } from '$lib/server/auth'
import { redirect, type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	await lucia.deleteExpiredSessions()

	const sessionId = event.cookies.get(lucia.sessionCookieName)

	const pathname = event.url.pathname

	if (
		pathname.startsWith('/dashboard') ||
		pathname.startsWith('/api')
	) {
		if (!sessionId) {
			redirect(303, '/login')
		}
		const { session, user } = await lucia.validateSession(sessionId)

		if (!user) {
			event.locals.session = null
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

	const authPaths = ['/login', '/signup']

	if (authPaths.includes(pathname)) {
		if (!sessionId) {
			event.locals.session = null
			const response = await resolve(event)

			return response
		}

		const { session, user } = await lucia.validateSession(sessionId)
		if (user) {
			redirect(303, '/dashboard')
		}

		event.locals.session = null
		const response = await resolve(event)

		return response
	}

	const response = await resolve(event)

	return response
}
