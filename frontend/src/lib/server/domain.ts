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
		console.log('create custom domain (railway)')
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
	} else if (env.PRIVATE_HOSTING_PROVIDER == 'fly.io') {
		console.log('create custom domain (fly.io)')
		const { flyioClient } = await import('./flyio')

		const response = await flyioClient.createCustomDomain(domain)

		if (!response.success) {
			return { success: false, id: undefined, ip: undefined } as const
		}

		return {
			success: true,
			id: domain,
			ip: undefined,
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
		console.log('delete custom domain (railway)')
		const { railwayClient } = await import('./railway')

		const response = await railwayClient.deleteCustomDomain(domain)

		if (!response.success) {
			return { success: false } as const
		}

		return {
			success: true,
		} as const
	} else if (env.PRIVATE_HOSTING_PROVIDER === 'fly.io') {
		console.log('delete custom domain (fly.io)')
		const { flyioClient } = await import('./flyio')

		const response = await flyioClient.deleteCustomDomain(domain)

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
