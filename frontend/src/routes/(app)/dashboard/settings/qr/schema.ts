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
	qrCornerSquareStyle: z.custom<'dot' | 'square' | 'extra-rounded'>(),
	qrDotStyle: z.custom<'square' | 'rounded'>(),
	qrImage: z
		.instanceof(File, { message: 'Please upload a file' })
		.refine(
			(file) =>
				file.type === 'image/jpeg' || file.type === 'image/png',
			{
				message: 'Only JPEG or PNG files are allowed',
			},
		)
		.optional()
		.nullable(),
})
