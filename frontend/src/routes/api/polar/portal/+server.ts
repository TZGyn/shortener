import { env } from '$env/dynamic/private'
import { CustomerPortal } from '@polar-sh/sveltekit'

export const GET = CustomerPortal({
	accessToken: env.PRIVATE_POLAR_ACCESS_KEY,
	getCustomerId: async (event) =>
		event.locals.user.polarCustomerId || '', // Fuction to resolve a Polar Customer ID
	server: env.APP_ENV === 'prod' ? 'production' : 'sandbox',
})
