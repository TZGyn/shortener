import { z } from 'zod'

export const formSchema = z.object({
	link: z.string(),
	active: z.boolean(),
	ios: z.boolean(),
	ios_link: z.string().nullable(),
	android: z.boolean(),
	android_link: z.string().nullable(),
})

export type FormSchema = typeof formSchema
