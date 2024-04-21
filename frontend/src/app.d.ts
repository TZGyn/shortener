// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('lucia').User
			session: import('lucia').Session | null
		}
		// interface PageData {}
		// interface Platform {}
		interface PageState {
			editProjectLink: {
				project: {
					id: number
					name: string
					userId: number
					uuid: string | null
				}
				user: User
				breadcrumbs: {
					name: string
					path: string
				}[]
				page_title: string
				shortener_url: string
				form: SuperValidated<
					{
						link: string
						ios: boolean
						ios_link: string
						android: boolean
						android_link: string
						active: boolean
					},
					any,
					{
						link: string
						ios: boolean
						ios_link: string
						android: boolean
						android_link: string
						active: boolean
					}
				>
			}
		}
	}
}

export {}
