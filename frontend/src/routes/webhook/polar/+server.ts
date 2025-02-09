import { env } from '$env/dynamic/private'
import { db } from '$lib/db'
import { user } from '$lib/db/schema'
import { Webhooks } from '@polar-sh/sveltekit'
import { eq } from 'drizzle-orm'

export const POST = Webhooks({
	webhookSecret: env.PRIVATE_POLAR_WEBHOOK_SECRET,
	onSubscriptionRevoked: async (payload) => {
		if (
			payload.data.priceId === env.PRIVATE_POLAR_PRO_PLAN_PRICE_ID
		) {
			const customerId = payload.data.customerId

			if (!customerId) return

			await db
				.update(user)
				.set({
					plan: 'free',
				})
				.where(eq(user.polarCustomerId, customerId))
		}
	},
	onOrderCreated: async (payload) => {
		if (
			payload.data.billingReason === 'subscription_cycle' ||
			payload.data.billingReason === 'subscription_create'
		) {
			const priceId = payload.data.productPriceId
			if (priceId === env.PRIVATE_POLAR_PRO_PLAN_PRICE_ID) {
				const customerId = payload.data.customerId

				if (!customerId) return

				await db
					.update(user)
					.set({
						plan: 'pro',
					})
					.where(eq(user.polarCustomerId, customerId))
			}
		}
	},
})
