import { lucia } from '$lib/server/auth'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	return new Response()
}

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Invalid User',
			}),
		)
	}
	await lucia.invalidateSession(event.locals.session.id)
	const sessionCookie = lucia.createBlankSessionCookie()
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		...sessionCookie.attributes,
		path: '/',
		secure: Bun.env.APP_ENV === 'prod',
	})
	return new Response(JSON.stringify({ success: true }))
}
