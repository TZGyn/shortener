import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3,
	S3Client,
} from '@aws-sdk/client-s3'
import type { RequestHandler } from './$types'
import { env } from '$env/dynamic/private'
import { json } from '@sveltejs/kit'
import { z } from 'zod'
import { db } from '$lib/db'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { file, shortener, user as userTable } from '$lib/db/schema'
import { and, eq, isNull } from 'drizzle-orm'

const client = new S3({
	region: 'auto',
	endpoint: `https://fly.storage.tigris.dev`,
	credentials: {
		accessKeyId: env.PRIVATE_AWS_ACCESS_KEY_ID,
		secretAccessKey: env.PRIVATE_AWS_SECRET_ACCESS_KEY,
	},
})

export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	const activeProjectId = event.params.project_id
	const filename = event.params.file_id

	const file = await client.getObject({
		Bucket: env.PRIVATE_AWS_BUCKET_NAME,
		Key: `${user.id}/${activeProjectId}/${filename}`,
	})

	return json({
		success: true,
		file: {
			eTag: file.ETag,
			size: file.ContentLength,
			name: filename,
		},
	})
}

export const DELETE: RequestHandler = async (event) => {
	const user = event.locals.user

	const deleteFile = event.params.file_id

	if (deleteFile.includes('/')) {
		return json({ success: false, message: 'Invalid File Name' })
	}

	const projectId = event.params.project_id

	const project =
		projectId !== 'personal'
			? await db.query.project.findFirst({
					where: (projectTable, { eq, and }) =>
						and(
							eq(projectTable.id, projectId),
							eq(projectTable.userId, user.id),
						),
			  })
			: undefined

	const key = `${user.id}/${project?.id || 'personal'}/${deleteFile}`

	try {
		await client.send(
			new DeleteObjectCommand({
				Bucket: env.PRIVATE_AWS_BUCKET_NAME,
				Key: key,
			}),
		)

		await db
			.delete(shortener)
			.where(
				and(
					eq(shortener.userId, user.id),
					projectId !== 'personal'
						? eq(shortener.projectId, projectId)
						: isNull(shortener.projectId),
					eq(shortener.is_file_upload, true),
					eq(shortener.file_path, key),
				),
			)

		const deletedFile = await db
			.delete(file)
			.where(eq(file.key, key))
			.returning()

		if (deletedFile.length > 0) {
			await db
				.update(userTable)
				.set({
					fileStorageUsageInByte:
						user.fileStorageUsageInByte - deletedFile[0].size,
				})
				.where(eq(userTable.id, user.id))
		}
	} catch (error) {
		console.log(error)
	}

	return json({ success: true })
}
