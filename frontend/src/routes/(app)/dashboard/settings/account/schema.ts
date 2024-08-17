import { z } from 'zod'

export const formSchema = z.object({
	username: z.string().optional(),
	email: z.string().email().optional(),
})

export const verifyEmailSchema = z.object({})

export type FormSchema = typeof formSchema
