import { z } from 'zod'

export const userUpdateSchema = z.object({
	username: z.string(),
	old_password: z.string(),
	new_password: z.string(),
	confirm_password: z.string(),
})

export const userCreateSchema = z.object({
	email: z.string().email(),
	password: z.string(),
	password_confirm: z.string(),
})
