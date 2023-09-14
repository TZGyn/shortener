import { Database } from './types'
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

const dialect = new PostgresDialect({
	pool: new Pool({
		database: 'link-shortener',
		host: '0.0.0.0',
		user: 'postgres',
		password: 'password',
		port: 5432,
		max: 10,
	}),
})

export const db = new Kysely<Database>({
	dialect,
})
