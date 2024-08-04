import { z } from 'zod'

export const formSchema = z.object({
	qr_background: z
		.string()
		.min(1, { message: 'Background color is required' })
		.max(7),
	qr_foreground: z
		.string()
		.min(1, { message: 'Foreground color is required' })
		.max(7),
})
