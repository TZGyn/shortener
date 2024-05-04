// See https://kit.svelte.dev/docs/types#app

import type { Project, Setting, Shortener } from '$lib/db/types'

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
			linkQR: {
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
				settings: Setting
			}
			editLink: {
				user: User
				breadcrumbs: {
					name: string
					path: string
				}[]
				page_title: string
				shortener_url: string
				projects: Project[]
				selectedCategory:
					| {
							value: string | null
							label: string
					  }
					| undefined
				shortener: Shortener
				form: SuperValidated<
					{
						link: string
						ios: boolean
						ios_link: string
						android: boolean
						android_link: string
						active: boolean
						project?: string | undefined
					},
					any,
					{
						link: string
						ios: boolean
						ios_link: string
						android: boolean
						android_link: string
						active: boolean
						project?: string | undefined
					}
				>
			}
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
				shortener: Shortener
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
