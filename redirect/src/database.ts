import { Database } from './types'
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString:
			Bun.env.DATABASE_URL ??
			'postgres://postgres:password@0.0.0.0:5432/link-shortener',
		max: 10,
	}),
})

export const db = new Kysely<Database>({
	dialect,
})
