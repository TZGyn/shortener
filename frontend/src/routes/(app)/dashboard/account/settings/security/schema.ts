import { z } from 'zod'

export const changePasswordFormSchema = z
	.object({
		old_password: z.string(),
		new_password: z.string().min(8, {
			message: 'Password must be at least 8 characters long',
		}),
		confirm_password: z.string().min(8, {
			message: 'Password must be at least 8 characters long',
		}),
	})
	.refine(
		(data) => data.new_password == data.confirm_password,
		"Passwords didn't match.",
	)

export const verifyEmailSchema = z.object({})

export const deleteAccountSchema = z.object({ password: z.string() })

export type FormSchema = typeof changePasswordFormSchema
