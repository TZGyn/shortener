import { db } from '$lib/db'
import { shortener as shortenerSchema } from '$lib/db/schema'
import { and, eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'
import { z } from 'zod'

export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
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
	projectId: z.string().nullish(),
	active: z.boolean(),
})

export const PUT: RequestHandler = async (event) => {
	const user = event.locals.user

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
			active: updateShortener.data.active,
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
	const id = z.string().safeParse(shortenerId)

	if (!id.success) {
		return new Response(
			JSON.stringify({
				success: false,
			}),
		)
	}

	const user = event.locals.user

	const shortener = await db.query.shortener.findFirst({
		where: (shortener, { and, eq }) =>
			and(eq(shortener.id, id.data), eq(shortener.userId, user.id)),
	})

	if (shortener?.is_file_upload) {
		return new Response(
			JSON.stringify({
				success: false,
			}),
		)
	}

	await db
		.delete(shortenerSchema)
		.where(
			and(
				eq(shortenerSchema.id, id.data),
				eq(shortenerSchema.userId, user.id),
			),
		)
	return new Response(
		JSON.stringify({
			success: true,
		}),
	)
}
