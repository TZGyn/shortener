import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import Stripe from 'stripe'
import { db } from '$lib/db'
import { stripeSession } from '$lib/db/schema'
import { env } from '$env/dynamic/private'

export const load = (async (events) => {
	if (events.locals.user.stripeSubscription) {
		redirect(301, '/dashboard/billing')
	}
	if (!events.locals.user.email_verified) {
		redirect(301, '/dashboard/billing')
	}
	const stripe = new Stripe(env.PRIVATE_STRIPE_SECRET_KEY)
	const session = await stripe.checkout.sessions.create({
		customer_email: events.locals.user.email,
		line_items: [
			{ price: env.PRIVATE_PRO_PLAN_PRICE_ID, quantity: 1 },
		],
		mode: 'subscription',
		ui_mode: 'hosted',
		success_url:
			env.ORIGIN +
			'/dashboard/billing/plan/pro/success?session_id={CHECKOUT_SESSION_ID}',
		cancel_url: env.ORIGIN + '/dashboard/billing',
	})

	if (!session.url) {
		redirect(301, '/dashboard/billing')
	}

	await db.insert(stripeSession).values({
		session_id: session.id,
		userId: events.locals.user.id,
		expired: false,
	})

	redirect(301, session.url)
}) satisfies PageServerLoad
