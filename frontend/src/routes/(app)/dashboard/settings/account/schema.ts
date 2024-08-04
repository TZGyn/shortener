import { z } from 'zod'

export const formSchema = z.object({
	username: z.string().optional(),
	email: z.string().email().optional(),
	old_password: z.string().optional(),
	new_password: z
		.string()
		.min(8, {
			message: 'Password must be at least 8 characters long',
		})
		.optional(),
	confirm_password: z
		.string()
		.min(8, {
			message: 'Password must be at least 8 characters long',
		})
		.optional(),
})

export const verifyEmailSchema = z.object({})

export type FormSchema = typeof formSchema
