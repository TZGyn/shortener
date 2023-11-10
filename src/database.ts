import { Database } from './types'
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

const dialect = new PostgresDialect({
	pool: new Pool({
		database: Bun.env.PGDATABASE ?? 'link-shortener',
		host: Bun.env.PGHOST ?? '0.0.0.0',
		user: Bun.env.PGUSER ?? 'postgres',
		password: Bun.env.PGPASSWORD ?? 'password',
		port: parseInt(Bun.env.PGPORT ?? '') ?? 5432,
		max: 10,
	}),
})

export const db = new Kysely<Database>({
	dialect,
})
