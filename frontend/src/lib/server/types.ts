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
