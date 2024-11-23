import { z } from 'zod'

export const formSchema = z.object({
	link: z.string().url(),
	active: z.boolean(),
	ios: z.boolean(),
	ios_link: z
		.union([z.literal(''), z.string().url()])
		.optional()
		.nullable(),
	android: z.boolean(),
	android_link: z
		.union([z.literal(''), z.string().url()])
		.optional()
		.nullable(),
	custom_code_enable: z.boolean(),
	custom_code: z.string(),
})

export type FormSchema = typeof formSchema
