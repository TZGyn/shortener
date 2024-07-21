import { Resend } from 'resend'
import { env } from '$env/dynamic/private'

export const resendClient = new Resend(env.PRIVATE_RESEND_API_KEY)

// await resendClient.emails.send({
// 	from: 'Kon.sh <no-reply@account.kon.sh>',
// 	to: ['delivered@resend.dev'],
// 	subject: 'hello world',
// 	text: 'it works!',
// 	headers: {
// 		'X-Entity-Ref-ID': '123456789',
// 	},
// 	tags: [
// 		{
// 			name: 'category',
// 			value: 'confirm_email',
// 		},
// 	],
// })
