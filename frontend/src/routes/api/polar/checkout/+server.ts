import { env } from '$env/dynamic/private'
import { Checkout } from '@polar-sh/sveltekit'

export const GET = Checkout({
	accessToken: env.PRIVATE_POLAR_ACCESS_KEY,
	successUrl: env.APP_URL + '/dashboard/',
	server: env.APP_ENV === 'prod' ? 'production' : 'sandbox',
})
