import { z } from 'zod'

export const userUpdateSchema = z.object({
	username: z.string(),
	old_password: z.string(),
	new_password: z.string(),
	confirm_password: z.string(),
})
