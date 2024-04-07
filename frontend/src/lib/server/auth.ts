import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { db } from '$lib/db'
import { session, user, type User } from '$lib/db/schema'
import { Lucia } from 'lucia'

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
		UserId: number
		DatabaseUserAttributes: DatabaseUserAttributes
	}
}

interface DatabaseUserAttributes extends Omit<User, 'password'> {}

const adapter = new DrizzlePostgreSQLAdapter(db, session, user)

export const lucia = new Lucia(adapter, {
	getUserAttributes: (attributes) => {
		return {
			...attributes,
		}
	},
})
