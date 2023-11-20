import { db } from '$lib/db'
import { shortener } from '$lib/db/schema'
import {
	getUserFromEvent,
	getUserFromSessionToken,
} from '$lib/server/auth'
import { and, eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'
import { z } from 'zod'

export const GET: RequestHandler = async () => {
	return new Response()
}

const updateShortenerSchema = z.object({
	link: z.string().url(),
})

export const PUT: RequestHandler = async (event) => {
	const data = await getUserFromEvent(event)

	if (!data.success) {
		return new Response(data.response)
	}

	const user = data.user

	const shortenerId = event.params.id
	const body = await event.request.json()

	const updateShortener = updateShortenerSchema.safeParse(body)

	if (!updateShortener.success) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Invalid Request',
			}),
		)
	}

	await db
		.update(shortener)
		.set({ link: updateShortener.data.link })
		.where(
			and(
				eq(shortener.code, shortenerId),
				eq(shortener.userId, user.id),
			),
		)

	return new Response(JSON.stringify({ success: true }))
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
