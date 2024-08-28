import { z } from 'zod'

export const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters long',
	}),
	password_confirm: z.string().min(8, {
		message: 'Password must be at least 8 characters long',
	}),
})

export type FormSchema = typeof formSchema
