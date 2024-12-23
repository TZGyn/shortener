import { db } from '$lib/db'
import { file, shortener, user } from '$lib/db/schema'
import type { TigrisNotificationPayload } from '$lib/server/types'
import type { RequestHandler } from './$types'
import { generateId } from 'lucia'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { env } from '$env/dynamic/private'

const client = new S3Client({
	region: 'auto',
	endpoint: `https://fly.storage.tigris.dev`,
	credentials: {
		accessKeyId: env.PRIVATE_AWS_ACCESS_KEY_ID,
		secretAccessKey: env.PRIVATE_AWS_SECRET_ACCESS_KEY,
	},
})

export const POST: RequestHandler = async (event) => {
	const authHeader = event.request.headers.get('Authorization')
	console.log('auth header:', authHeader)

	if (
		!authHeader ||
		(env.PRIVATE_AWS_WEBHOOK_TOKEN &&
			authHeader !== `Bearer ${env.PRIVATE_AWS_WEBHOOK_TOKEN}`)
	) {
		console.log('Unauthorized')
		return new Response('', { status: 401 })
	}

	const body =
		(await event.request.json()) as TigrisNotificationPayload

	const eventHandlers = body.events.map(async (event) => {
		const [userId, projectId, filename] = event.object.key.split('/')

		const objectOwner = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.id, userId),
		})

		if (!objectOwner) return

		if (event.eventName === 'OBJECT_CREATED_PUT') {
			const existingShortener = await db.query.shortener.findFirst({
				where: (shortener, { eq, and, isNull }) =>
					and(
						eq(shortener.userId, userId),
						projectId !== 'personal'
							? eq(shortener.projectId, projectId)
							: isNull(shortener.projectId),
						eq(shortener.is_file_upload, true),
						eq(shortener.file_path, event.object.key),
					),
			})

			if (!existingShortener) {
				await db.insert(shortener).values({
					id: generateId(8),
					link: '',
					code: nanoid(8),
					projectId: projectId !== 'personal' ? projectId : undefined,
					userId: userId,
					is_file_upload: true,
					file_path: event.object.key,
				})
			}

			const object = await client.send(
				new GetObjectCommand({
					Bucket: env.PRIVATE_AWS_BUCKET_NAME,
					Key: event.object.key,
				}),
			)

			const existingFile = await db.query.file.findFirst({
				where: (file, { eq }) => eq(file.key, event.object.key),
			})

			if (existingFile) {
				await db
					.update(file)
					.set({
						size: object.ContentLength,
						eTag: object.ETag,
						updatedAt: Date.now(),
					})
					.where(eq(file.id, existingFile.id))

				await db
					.update(user)
					.set({
						fileStorageUsageInByte:
							objectOwner.fileStorageUsageInByte +
							(object.ContentLength! - existingFile.size),
					})
					.where(eq(user.id, userId))
			} else {
				await db.insert(file).values({
					id: generateId(8),
					userId: userId,
					projectId: projectId !== 'personal' ? projectId : undefined,
					key: event.object.key,
					name: filename,
					size: object.ContentLength!,
					eTag: object.ETag!,
					createdAt: Date.now(),
					updatedAt: Date.now(),
				})

				await db
					.update(user)
					.set({
						fileStorageUsageInByte:
							objectOwner.fileStorageUsageInByte +
							(object.ContentLength || 0),
					})
					.where(eq(user.id, userId))
			}
		} else if (event.eventName === 'OBJECT_DELETED') {
		}
	})

	await Promise.all(eventHandlers)

	return new Response()
}
