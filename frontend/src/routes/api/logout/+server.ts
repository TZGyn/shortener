import { logoutUser } from '$lib/server/auth'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	return new Response()
}

export const POST: RequestHandler = async (event) => {
	const token = event.cookies.get('token')
	if (!token) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Invalid User',
			}),
		)
	}
	logoutUser(token)
	event.cookies.delete('token')
	return new Response(JSON.stringify({ success: true }))
}
