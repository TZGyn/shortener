import { z } from 'zod'

export const userUpdateSchema = z.object({
	username: z.string(),
})
