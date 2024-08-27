import { db } from '$lib/db'
import { user } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'
import { env } from '$env/dynamic/private'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async (event) => {
	return json({ test: 'test' })
}

export const POST: RequestHandler = async (event) => {
	try {
		const sig = event.request.headers.get('stripe-signature') || ''

		const arrayBuffer = await event.request.arrayBuffer()
		const body = Buffer.from(arrayBuffer)

		const stripe = new Stripe(env.PRIVATE_STRIPE_SECRET_KEY)

		const stripeEvent = stripe.webhooks.constructEvent(
			body,
			sig,
			'whsec_mCu3SWeY06KRY2vLCIYXlqLawTU6k3Wf',
		)
		if (
			stripeEvent.type === 'subscription_schedule.canceled' ||
			stripeEvent.type === 'customer.subscription.deleted'
		) {
			await db
				.update(user)
				.set({ plan: 'free' })
				.where(
					eq(user.stripeSubscription, stripeEvent.data.object.id),
				)
		}
		return new Response('Success', { status: 200 })
	} catch (err) {
		return new Response(`Webhook Error: ${err}`, {
			status: 400,
		})
	}
}
