import { z } from 'zod'

export const createLinkSchema = z.object({
	link: z.string().url(),
})
