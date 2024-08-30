import { z } from 'zod'

export const formSchema = z.object({
	name: z.string().nonempty(),
	qr_background: z
		.string()
		.min(1, { message: 'Background color is required' })
		.max(7),
	qr_foreground: z
		.string()
		.min(1, { message: 'Foreground color is required' })
		.max(7),
	qrCornerSquareStyle: z.custom<'dot' | 'square' | 'extra-rounded'>(),
	qrDotStyle: z.custom<'square' | 'rounded'>(),
})

export const enableCustomDomainFormSchema = z.object({
	enableDomain: z.string(),
})

export const customDomainFormSchema = z.object({
	domain: z.string(),
})

export type FormSchema = typeof formSchema

export const deleteSchema = z.object({
	deleteShorteners: z.boolean(),
})
