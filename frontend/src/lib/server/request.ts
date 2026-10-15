import type { RequestEvent } from '@sveltejs/kit'

// Behind a reverse proxy (Coolify/Traefik) the real client IP is only
// returned when ADDRESS_HEADER=X-Forwarded-For and XFF_DEPTH=1 are set in the
// production environment. Without them this returns the proxy's address.
export const getClientIp = (event: RequestEvent) => {
	try {
		return event.getClientAddress()
	} catch {
		return 'unknown'
	}
}
