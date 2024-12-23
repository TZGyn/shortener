import { z } from 'zod'
import type { RequestHandler } from './$types'

import { PutObjectCommand, S3Client, S3 } from '@aws-sdk/client-s3'
import { env } from '$env/dynamic/private'
import { json } from '@sveltejs/kit'
import { db } from '$lib/db'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const client = new S3({
	region: 'auto',
	endpoint: `https://fly.storage.tigris.dev`,
	credentials: {
		accessKeyId: env.PRIVATE_AWS_ACCESS_KEY_ID,
		secretAccessKey: env.PRIVATE_AWS_SECRET_ACCESS_KEY,
	},
})

const S3_Client = new S3Client({
	region: 'auto',
	endpoint: `https://fly.storage.tigris.dev`,
	credentials: {
		accessKeyId: env.PRIVATE_AWS_ACCESS_KEY_ID,
		secretAccessKey: env.PRIVATE_AWS_SECRET_ACCESS_KEY,
	},
})

const uploadFileSchema = z.object({
	fileName: z.string(),
	fileSize: z.number(),
	fileType: z.string(),
})

export const POST: RequestHandler = async (event) => {
	const user = event.locals.user

	if (user.plan === 'free') {
		return json({
			success: false,
			message: 'User Must Be Subscribed To Pro Plan',
		})
	}

	const body = await event.request.json()

	const uploadFile = uploadFileSchema.safeParse(body)

	if (!uploadFile.success) {
		return json({ success: false, message: 'Invalid Data' })
	}

	if (uploadFile.data.fileName.includes('/')) {
		return json({ success: false, message: 'Invalid File Name' })
	}

	if (
		user.fileStorageUsageInByte + uploadFile.data.fileSize >
		1_000_000_000 * 100
	) {
		return json({ success: false, message: 'Reached Max Uploads' })
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

	const key = `${user.id}/${project?.id || 'personal'}/${
		uploadFile.data.fileName
	}`

	const files = await client
		.listObjectsV2({
			Bucket: env.PRIVATE_AWS_BUCKET_NAME,
			Prefix: `${user.id}/${projectId}/`,
			Delimiter: '/',
			MaxKeys: 1000,
		})
		.then((data) => data.Contents)

	if (files && files.length >= 1000) {
		return json({
			success: false,
			message: 'Reached Max Upload Files For This Project',
		})
	}

	const link = await getSignedUrl(
		S3_Client,
		new PutObjectCommand({
			Bucket: env.PRIVATE_AWS_BUCKET_NAME,
			Key: key,
			ContentLength: uploadFile.data.fileSize,
			ContentType: uploadFile.data.fileType,
		}),
		{ expiresIn: 600 },
	)
	return json({ success: true, link })
}
