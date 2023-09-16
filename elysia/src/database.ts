import { Database } from './types'
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

const dialect = new PostgresDialect({
	pool: new Pool({
		database: 'link-shortener',
		host: Bun.env.host ?? '0.0.0.0',
		user: Bun.env.user ?? 'postgres',
		password: Bun.env.password ?? 'password',
		port: 5432,
		max: 10,
	}),
})

export const db = new Kysely<Database>({
	dialect,
})
