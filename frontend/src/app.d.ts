// See https://kit.svelte.dev/docs/types#app

import type { Project } from '$lib/db/types'

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
			projectLinkQR: {
				user: User
				breadcrumbs: {
					name: string
					path: string
				}[]
				page_title: string
				shortener_url: string
				shortener: {
					code: string
				}
				project: Project
			}
			editProjectLink: {
				project: Project
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
