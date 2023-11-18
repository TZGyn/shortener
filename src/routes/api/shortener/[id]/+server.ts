import { db } from '$lib/db'
import { shortener } from '$lib/db/schema'
import { getUserFromSessionToken } from '$lib/server/auth'
import { and, eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	return new Response()
}

export const DELETE: RequestHandler = async (event) => {
	const shortenerId = event.params.id
	const token = event.cookies.get('token')

	if (!token) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Invalid User',
			}),
		)
	}
	const user = await getUserFromSessionToken(token)

	if (!user) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Invalid User',
			}),
		)
	}

	await db
		.delete(shortener)
		.where(
			and(
				eq(shortener.code, shortenerId),
				eq(shortener.userId, user.id),
			),
		)
	return new Response(
		JSON.stringify({
			success: true,
		}),
	)
}
