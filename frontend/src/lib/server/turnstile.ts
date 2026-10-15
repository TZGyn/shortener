import { env } from '$env/dynamic/private'

// Optional bot protection for signup. When PRIVATE_TURNSTILE_SECRET_KEY is not
// configured (e.g. self-hosted instances), verification is skipped so signup
// keeps working.
export const verifyTurnstile = async (
	token: string | null,
	ip?: string,
) => {
	const secret = env.PRIVATE_TURNSTILE_SECRET_KEY

	if (!secret) {
		console.warn(
			'[turnstile] PRIVATE_TURNSTILE_SECRET_KEY not set, skipping verification',
		)
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
