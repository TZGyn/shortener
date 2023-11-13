import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const client = postgres(
	process.env.DATABASE_URL ??
		'postgres://postgres:password@127.0.0.1:5432/link-shortener',
)
export const db = drizzle(client, { schema })
