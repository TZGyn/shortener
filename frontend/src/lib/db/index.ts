import {
	drizzle,
	type PostgresJsDatabase,
} from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '$env/dynamic/private'

declare global {
	var db: PostgresJsDatabase<typeof schema> | undefined
}

let db: PostgresJsDatabase<typeof schema>
if (!global.db) {
	global.db = drizzle(postgres(env.DATABASE_URL), { schema })
}
db = global.db

export { db }
