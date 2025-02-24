import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import Stripe from 'stripe'
import { db } from '$lib/db'
import { env } from '$env/dynamic/private'
import { user as userTable } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import { Polar } from '@polar-sh/sdk'

export const load = (async (events) => {
	if (events.locals.user.plan !== 'free') {
		redirect(302, '/dashboard/billing')
	}
	if (!events.locals.user.email_verified) {
		redirect(302, '/dashboard/billing')
	}

	if (env.PAYMENT_PROVIDER === 'stripe') {
		const user = events.locals.user

		const stripe = new Stripe(env.PRIVATE_STRIPE_SECRET_KEY)

		let stripeCustomerId = events.locals.user.stripeCustomerId

		if (!stripeCustomerId) {
			const customer = await stripe.customers.create({
				email: user.email,
			})
			stripeCustomerId = customer.id
			await db
				.update(userTable)
				.set({
					stripeCustomerId: customer.id,
				})
				.where(eq(userTable.id, user.id))
		}

		const session = await stripe.checkout.sessions.create({
			customer: stripeCustomerId,
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
			redirect(302, '/dashboard/billing')
		}
		redirect(302, session.url)
	} else {
		const polar = new Polar({
			accessToken: env.PRIVATE_POLAR_ACCESS_KEY,
			server: env.APP_ENV === 'prod' ? 'production' : 'sandbox',
		})

		const user = events.locals.user

		let polarCustomerId = events.locals.user.polarCustomerId

		if (!polarCustomerId) {
			const result = await polar.customers.create({
				email: user.email,
			})

			await db
				.update(userTable)
				.set({
					polarCustomerId: result.id,
				})
				.where(eq(userTable.id, user.id))

			polarCustomerId = result.id
		}

		redirect(
			302,
			`/api/polar/checkout?productPriceId=${env.PRIVATE_POLAR_PRO_PLAN_PRICE_ID}&customerId=${polarCustomerId}`,
		)
	}
}) satisfies PageServerLoad
