import { z } from 'zod'

export const userLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

export const userCreateSchema = z.object({
	email: z.string().email(),
	password: z.string(),
	password_confirm: z.string(),
})

export type TigrisNotificationPayload = {
	events: {
		eventVersion: string
		eventSource: string
		eventName: 'OBJECT_CREATED_PUT' | 'OBJECT_DELETED'
		eventTime: string
		bucket: string
		object: {
			key: string
			size: number
			eTag: string
		}
	}[]
	sendTime: string
}
