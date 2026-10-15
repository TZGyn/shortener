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
		return true
	}

	if (!token) {
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
		const data = (await response.json()) as { success?: boolean }
		return data.success === true
	} catch {
		return false
	}
}
