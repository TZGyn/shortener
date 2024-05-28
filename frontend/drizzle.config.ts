// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
	schema: './src/lib/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		user: 'postgres',
		password: 'password',
		host: '192.168.100.110',
		port: 5432,
		database: 'link-shortener',
	},
} satisfies Config
