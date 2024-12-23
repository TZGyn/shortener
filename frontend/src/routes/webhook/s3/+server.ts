import { db } from '$lib/db'
import { shortener } from '$lib/db/schema'
import type { RequestHandler } from './$types'
import util from 'util'
import { generateId } from 'lucia'
import { nanoid } from 'nanoid'
import { and, eq, isNull } from 'drizzle-orm'

type S3WebhookStructure = {
	Records: {
		eventVersion: string // '2.2'
		eventSource: string // 'aws:s3'
		awsRegion: string // 'us-west-2'
		eventTime: string // 'The time, in ISO-8601 format, for example, 1970-01-01T00:00:00.000Z, when Amazon S3 finished processing the request'
		eventName: string // 'event-type' "ObjectCreated:Put"
		userIdentity: {
			principalId: string // 'Amazon-customer-ID-of-the-user-who-caused-the-event' "AIDAJDPLRKLG7UEXAMPLE"
		}
		requestParameters: {
			sourceIPAddress: string // 'ip-address-where-request-came-from' "127.0.0.1"
		}
		responseElements: {
			'x-amz-request-id': string // 'Amazon S3 generated request ID'
			'x-amz-id-2': string // 'Amazon S3 host that processed the request'
		}
		s3: {
			s3SchemaVersion: string // '1.0'
			configurationId: string // 'ID found in the bucket notification configuration'
			bucket: {
				name: string // 'amzn-s3-demo-bucket'
				ownerIdentity: {
					principalId: string // 'Amazon-customer-ID-of-the-bucket-owner'
				}
				arn: string // 'bucket-ARN' "arn:aws:s3:::amzn-s3-demo-bucket"
			}
			object: {
				key: string // 'object-key' "HappyFace.jpg"
				size: number // 'object-size in bytes' 1024
				eTag: string // 'object eTag' "d41d8cd98f00b204e9800998ecf8427e"
				versionId: string // 'object version if bucket is versioning-enabled, otherwise null' "096fKKXTRTtl3on89fVO.nfljtsv6qko"
				sequencer: string // 'a string representation of a hexadecimal value used to determine event sequence, only used with PUTs and DELETEs' "0055AED6DCD90281E5"
			}
		}
		glacierEventData: {
			restoreEventData: {
				lifecycleRestorationExpiryTime: string // 'The time, in ISO-8601 format, for example, 1970-01-01T00:00:00.000Z, of Restore Expiry'
				lifecycleRestoreStorageClass: string // 'Source storage class for restore'
			}
		}
	}[]
}

export const POST: RequestHandler = async (event) => {
	const body = (await event.request.json()) as S3WebhookStructure

	const eventHandlers = body.Records.map(async (event) => {
		console.log(
			util.inspect(event, false, null, true /* enable colors */),
		)

		if (event.eventName === 'ObjectCreated:Put') {
			const key = event.s3.object.key
			const [userId, projectId, filename] = key.split('/')
			const existingShortener = await db.query.shortener.findFirst({
				where: (shortener, { eq, and, isNull }) =>
					and(
						eq(shortener.userId, userId),
						projectId !== 'personal'
							? eq(shortener.projectId, projectId)
							: isNull(shortener.projectId),
						eq(shortener.is_file_upload, true),
						eq(shortener.file_path, key),
					),
			})

			if (existingShortener) {
				return
			}

			await db.insert(shortener).values({
				id: generateId(8),
				link: '',
				code: nanoid(8),
				projectId: projectId !== 'personal' ? projectId : undefined,
				userId: userId,
				is_file_upload: true,
				file_path: key,
			})
		} else if (event.eventName === 's3:ObjectRemoved:Delete') {
			const key = event.s3.object.key
			const [userId, projectId, filename] = key.split('/')
			await db
				.delete(shortener)
				.where(
					and(
						eq(shortener.userId, userId),
						projectId !== 'personal'
							? eq(shortener.projectId, projectId)
							: isNull(shortener.projectId),
						eq(shortener.is_file_upload, true),
						eq(shortener.file_path, key),
					),
				)
		}
	})

	await Promise.all(eventHandlers)

	return new Response()
}
