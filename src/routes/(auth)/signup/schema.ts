import { z } from 'zod'

export const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	password_confirm: z.string().min(8),
})

export type FormSchema = typeof formSchema
