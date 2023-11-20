// See https://kit.svelte.dev/docs/types#app

import type { User } from '$lib/db/schema'

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			userObject: User
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
