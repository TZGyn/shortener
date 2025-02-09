import type { Actions, PageServerLoad } from './$types'
import Stripe from 'stripe'
import { env } from '$env/dynamic/private'
import { fail, setMessage, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { cancelSubscriptionSchema } from './schema'
import { Polar } from '@polar-sh/sdk'
import { redirect } from '@sveltejs/kit'

export const load = (async () => {
	const breadcrumbs = [
		{ name: 'Billing', path: '/dashboard/billing' },
	]

	return {
		breadcrumbs,
		cancel_subscription_form: await superValidate(
			zod(cancelSubscriptionSchema),
		),
		isPolar: env.PAYMENT_PROVIDER !== 'stripe',
	}
}) satisfies PageServerLoad

export const actions = {
	cancel_subscription: async (event) => {
		const form = await superValidate(
			event,
			zod(cancelSubscriptionSchema),
		)
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}
		if (env.PAYMENT_PROVIDER === 'stripe') {
			const stripe = new Stripe(env.PRIVATE_STRIPE_SECRET_KEY)

			const user = event.locals.user

			if (!user.stripeCustomerId) return { form }

			const subscription = await stripe.subscriptions.list({
				customer: user.stripeCustomerId,
				price: env.PRIVATE_PRO_PLAN_PRICE_ID,
				limit: 1,
			})

			const cancelSubscription = await stripe.subscriptions.update(
				subscription.data[0].id,
				{ cancel_at_period_end: true },
			)
		} else {
		}

		setMessage(form, 'Successfully cancelled subsciption')
		return { form }
	},
} satisfies Actions
