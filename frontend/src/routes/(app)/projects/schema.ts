import { z } from 'zod'

export const formSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
})

export type FormSchema = typeof formSchema
