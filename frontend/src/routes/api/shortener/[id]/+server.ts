import { db } from '$lib/db'
import { shortener as shortenerSchema } from '$lib/db/schema'
import { and, eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'
import { z } from 'zod'

export const GET: RequestHandler = async (event) => {
	const user = event.locals.userObject
	const shortenerId = event.params.id

	const shortener = await db.query.shortener.findFirst({
		where: (shortener, { eq, and }) =>
			and(
				eq(shortener.code, shortenerId),
				eq(shortener.userId, user.id),
			),
	})

	if (!shortener) {
		return generateResponse({
			success: false,
			message: 'Invalid Shortener',
		})
	}

	return generateResponse({
		success: true,
		data: shortener,
	})
}

const updateShortenerSchema = z.object({
	link: z.string().url(),
	projectId: z.number().nullable(),
})

export const PUT: RequestHandler = async (event) => {
	const user = event.locals.userObject

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
		.update(shortenerSchema)
		.set({
			link: updateShortener.data.link,
			projectId: updateShortener.data.projectId ?? undefined,
		})
		.where(
			and(
				eq(shortenerSchema.code, shortenerId),
				eq(shortenerSchema.userId, user.id),
			),
		)

	return new Response(JSON.stringify({ success: true }))
}

export const DELETE: RequestHandler = async (event) => {
	const shortenerId = event.params.id
	const user = event.locals.userObject

	await db
		.delete(shortenerSchema)
		.where(
			and(
				eq(shortenerSchema.code, shortenerId),
				eq(shortenerSchema.userId, user.id),
			),
		)
	return new Response(
		JSON.stringify({
			success: true,
		}),
	)
}
