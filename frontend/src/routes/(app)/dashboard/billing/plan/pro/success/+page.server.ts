import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import Stripe from 'stripe'
import { db } from '$lib/db'
import { user, stripeSession } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import { env } from '$env/dynamic/private'

export const load = (async ({ url }) => {
	const session_id = url.searchParams.get('session_id')

	const stripe = new Stripe(env.PRIVATE_STRIPE_SECRET_KEY)
	if (!session_id) redirect(301, '/dashboard/billing')
	const session = await stripe.checkout.sessions.retrieve(session_id)

	if (
		session.status === 'complete' &&
		session.payment_status === 'paid'
	) {
		const stripe_session = await db.query.stripeSession.findFirst({
			where: (stripeSession, { eq }) =>
				eq(stripeSession.session_id, session_id),
			with: {
				user: true,
			},
		})
		if (!stripe_session) redirect(301, '/dashboard/billing')

		await db
			.update(user)
			.set({
				plan: 'pro',
				stripeSubscription: session.subscription?.toString(),
			})
			.where(eq(user.id, stripe_session.user.id))

		await db
			.update(stripeSession)
			.set({ expired: true })
			.where(eq(stripeSession.session_id, session_id))

		redirect(301, '/dashboard/billing')
	}
}) satisfies PageServerLoad
