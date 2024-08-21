import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { db } from '$lib/db'
import { session, user } from '$lib/db/schema'
import { type User } from '$lib/db/types'
import { Lucia } from 'lucia'
import { Google } from 'arctic'
import { env } from '$env/dynamic/private'

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

export const google = new Google(
	env.PRIVATE_GOOGLE_CLIENT_ID,
	env.PRIVATE_GOOGLE_CLIENT_SECRET,
	(env.APP_ENV === 'prod' ? env.ORIGIN : 'http://localhost:5173') +
		'/login/google/callback',
)
