import * as schema from './schema'
import { env } from '$env/dynamic/private'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
	connectionString: env.DATABASE_URL,
	min: 1,
})
export const db = drizzle(pool, { schema })
