import { env } from '$env/dynamic/private'

export const checkDomainAvailable = async (domain: string) => {
	if (env.PRIVATE_HOSTING_PROVIDER === 'railway') {
		const { railwayClient } = await import('./railway')

		const available = await railwayClient.checkDomain(domain)

		return available
	} else {
		return true
	}
}

export const createCustomDomain = async (domain: string) => {
	if (env.PRIVATE_HOSTING_PROVIDER === 'railway') {
		const { railwayClient } = await import('./railway')

		const response = await railwayClient.createCustomDomain(domain)

		if (!response.success) {
			return { success: false, id: undefined, ip: undefined } as const
		}

		return {
			success: true,
			id: response.domain.id,
			ip: response.domain.record,
		} as const
	} else {
		return { id: undefined, ip: undefined } as const
	}
}

export const deleteCustomDomain = async (domain: string | null) => {
	if (!domain) {
		return { success: true } as const
	}
	if (env.PRIVATE_HOSTING_PROVIDER === 'railway') {
		const { railwayClient } = await import('./railway')

		const response = await railwayClient.deleteCustomDomain(domain)

		if (!response.success) {
			return { success: false } as const
		}

		return {
			success: true,
		} as const
	} else {
		return { success: true } as const
	}
}
