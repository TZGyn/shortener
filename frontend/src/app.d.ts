// See https://kit.svelte.dev/docs/types#app

import type { User } from '$lib/db/schema'

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
	}
}

export {}
