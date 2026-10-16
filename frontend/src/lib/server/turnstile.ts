import { env as privateEnv } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'

// Turnstile is only enforced when both keys are configured, so self-hosted
// instances that do not provide them skip it entirely.
export const verifyTurnstile = async (
	token: string | null,
	ip?: string,
) => {
	const secret = privateEnv.PRIVATE_TURNSTILE_SECRET_KEY
	const siteKey = publicEnv.PUBLIC_TURNSTILE_SITE_KEY

	if (!secret || !siteKey) {
		console.warn(
			`[turnstile] disabled, skipping (siteKey=${Boolean(
				siteKey,
			)}, secret=${Boolean(secret)})`,
		)
		return true
	}

	if (!token) {
		console.warn('[turnstile] rejected: no token provided')
		return false
	}

	const body = new URLSearchParams({ secret, response: token })
	if (ip) {
		body.set('remoteip', ip)
	}

	try {
		const response = await fetch(
			'https://challenges.cloudflare.com/turnstile/v0/siteverify',
			{ method: 'POST', body },
		)
		const data = (await response.json()) as {
			success?: boolean
			'error-codes'?: string[]
		}

		if (data.success !== true) {
			console.warn(
				'[turnstile] rejected:',
				data['error-codes'] ?? 'unknown',
			)
			return false
		}

		console.log('[turnstile] verified')
		return true
	} catch (e) {
		console.warn('[turnstile] verification request failed', e)
		return false
	}
}
