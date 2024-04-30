import { z } from 'zod'

export const formSchema = z.object({
	link: z.string(),
	project: z.string().optional(),
	active: z.boolean(),
	ios: z.boolean(),
	ios_link: z.string(),
	android: z.boolean(),
	android_link: z.string(),
})

export type FormSchema = typeof formSchema
