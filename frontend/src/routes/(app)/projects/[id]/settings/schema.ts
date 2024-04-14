import { z } from 'zod'

export const formSchema = z.object({
	name: z.string().nonempty(),
})

export type FormSchema = typeof formSchema

export const deleteSchema = z.object({
	deleteShorteners: z.boolean(),
})
