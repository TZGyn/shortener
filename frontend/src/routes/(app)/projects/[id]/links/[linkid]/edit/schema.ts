import { z } from 'zod'

export const formSchema = z.object({
	link: z.string().url(),
	project: z.string().optional(),
	active: z.boolean(),
	ios: z.boolean(),
	ios_link: z.string().url().optional().nullable().or(z.literal('')),
	android: z.boolean(),
	android_link: z
		.string()
		.url()
		.optional()
		.nullable()
		.or(z.literal('')),
	custom_code_enable: z.boolean(),
	custom_code: z.string(),
})

export type FormSchema = typeof formSchema
