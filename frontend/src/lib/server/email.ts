import { env } from '$env/dynamic/private'
import { db } from '$lib/db'
import { emailVerificationToken } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'
import { TimeSpan, createDate } from 'oslo'

export const sendEmail = async ({
	to,
	subject,
	html,
}: {
	to: string[]
	subject: string
	html: string
}) => {
	if (env.PRIVATE_MAIL_PROVIDER === 'resend') {
		const { resendClient } = await import('./resend')

		await resendClient.emails.send({
			from: 'Kon.sh <no-reply@account.kon.sh>',
			to,
			subject,
			html,
		})

		return { success: true, error: null }
	}
	return {
		success: false,
		error: { message: 'Email provider not found' },
	}
}

export const sendEmailVerification = async ({
	userId,
	email,
}: {
	userId: number
	email: string
}) => {
	await db
		.delete(emailVerificationToken)
		.where(eq(emailVerificationToken.userId, userId))

	const tokenId = generateId(25)

	await db.insert(emailVerificationToken).values({
		id: tokenId,
		userId,
		email: email,
		expiresAt: createDate(new TimeSpan(2, 'h')),
	})

	const verificationLink =
		env.ORIGIN + '/email-verification/' + tokenId

	await sendEmail({
		to: [email],
		subject: 'Verify Your Email',
		html: `
            <style type="text/css">
              :root {
                font-family: 'Arial';
              }
            </style>
            Please verify your email address by clicking the link below.
            <br/>
            <br/>
            <a href="${verificationLink}">${verificationLink}</a>
        `,
	})

	return { success: true, error: null }
}
