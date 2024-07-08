import { env } from '$env/dynamic/private'

class RailwayAPI {
	constructor(private apiKey: string) {}

	private sendRequest(query: string, variables: any) {
		return fetch(`https://backboard.railway.app/graphql/v2`, {
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
            mutation customDomainCreate($input: CustomDomainCreateInput!) {
              customDomainCreate(input: $input) {
                __typename
                createdAt
                deletedAt
                domain
                environmentId
                id
                projectId
                serviceId
                status {
                  dnsRecords {
                    requiredValue
                  }
                }
                updatedAt
              }
            }
        `
		const variables = {
			input: {
				domain: domain,
				environmentId: env.PRIVATE_RAILWAY_ENVIRONMENT_ID,
				projectId: env.PRIVATE_RAILWAY_PROJECT_ID,
				serviceId: env.PRIVATE_RAILWAY_SERVICE_ID,
			},
		}
		const response = await this.sendRequest(query, variables)
		const data: any = await response.json()
		if (!data.errors) {
			console.log('Railway Create Domain', data)
			return {
				success: true,
				domain: {
					id: data.data.customDomainCreate.id as string,
					record: data.data.customDomainCreate.status.dnsRecords[0]
						.requiredValue as string,
				},
			} as const
		} else {
			return {
				success: false,
				message: 'Something went wrong',
			} as const
		}
	}

	async deleteCustomDomain(id: string) {
		const query = `
            mutation customDomainDelete($id: String!) {
              customDomainDelete(id: $id)

            }
        `
		const variables = {
			id: id,
		}
		const response = await this.sendRequest(query, variables)
		if (response.ok) {
			const data: any = await response.json()
			console.log('Railway Delete Domain', data)
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

export const railwayClient = new RailwayAPI(
	env.PRIVATE_RAILWAY_API_KEY,
)
