import { env } from '$env/dynamic/private'

class FlyioAPI {
	constructor(private apiKey: string) {}

	private sendRequest(query: string, variables: any) {
		return fetch(`https://api.fly.io/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.apiKey}`,
			},
			body: JSON.stringify({ query, variables }),
		})
	}

	async checkDomain(domain: string) {
		const query = `
            query customDomainAvailable($domain: String!) {
              customDomainAvailable(domain: $domain) {
                __typename
                available
                message
              }
            }
        `
		const variables = {
			domain: domain,
		}
		const response = await this.sendRequest(query, variables)
		if (response.ok) {
			const data: any = await response.json()
			if (data.data.customDomainAvailable.available) {
				return true
			} else {
				return false
			}
		} else {
			return false
		}
	}

	async createCustomDomain(domain: string) {
		const query = `
			mutation($appId: ID!, $hostname: String!) {
				addCertificate(appId: $appId, hostname: $hostname) {
					certificate {
						configured
						acmeDnsConfigured
						acmeAlpnConfigured
						certificateAuthority
						certificateRequestedAt
						dnsProvider
						dnsValidationInstructions
						dnsValidationHostname
						dnsValidationTarget
						hostname
						id
						source
					}
				}
			}
		`
		const variables = {
			appId: env.PRIVATE_FLYIO_APP_ID,
			hostname: domain,
		}
		const response = await this.sendRequest(query, variables)
		const data: any = await response.json()
		if (!data.errors) {
			return {
				success: true,
			} as const
		} else {
			return {
				success: false,
				message: 'Something went wrong',
			} as const
		}
	}

	async deleteCustomDomain(domain: string) {
		const query = `
			mutation ($appId: ID!, $hostname: String!) {
				deleteCertificate(appId: $appId, hostname: $hostname) {
					certificate {
					configured
					acmeDnsConfigured
					acmeAlpnConfigured
					certificateAuthority
					certificateRequestedAt
					dnsProvider
					dnsValidationInstructions
					dnsValidationHostname
					dnsValidationTarget
					hostname
					id
					source
					}
				}
			}
        `
		const variables = {
			appId: env.PRIVATE_FLYIO_APP_ID,
			hostname: domain,
		}
		const response = await this.sendRequest(query, variables)
		const data: any = await response.json()
		if (!data.errors) {
			console.log('Fly.io Delete Domain', data)
			return {
				success: true,
			} as const
		} else {
			return {
				success: false,
			} as const
		}
	}
}

export const flyioClient = new FlyioAPI(env.PRIVATE_FLYIO_API_KEY)
