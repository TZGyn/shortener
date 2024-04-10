import {
	pgTable,
	serial,
	varchar,
	timestamp,
	integer,
	uuid,
	boolean,
} from 'drizzle-orm/pg-core'

export const shortener = pgTable('shortener', {
	id: serial('id').primaryKey().notNull(),
	link: varchar('link', { length: 255 }).notNull(),
	code: varchar('code', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' })
		.defaultNow()
		.notNull(),
	userId: integer('user_id').notNull(),
	active: boolean('active').notNull().default(true),
	projectId: integer('project_id'),
})

export const project = pgTable('project', {
	id: serial('id').primaryKey().notNull(),
	uuid: uuid('uuid').defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	userId: integer('user_id').notNull(),
})

export const user = pgTable('user', {
	id: serial('id').primaryKey().notNull(),
	uuid: uuid('uuid').defaultRandom(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	username: varchar('username', { length: 255 }),
	password: varchar('password', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' })
		.defaultNow()
		.notNull(),
})

export const visitor = pgTable('visitor', {
	id: serial('id').primaryKey().notNull(),
	shortenerId: integer('shortener_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' })
		.defaultNow()
		.notNull(),
	countryCode: varchar('country_code', {
		length: 255,
	}).notNull(),
	country: varchar('country', { length: 255 }).notNull(),
	city: varchar('city', { length: 255 }).notNull(),
	deviceType: varchar('device_type', { length: 255 }),
	deviceVendor: varchar('device_vendor', { length: 255 }),
	os: varchar('os', { length: 255 }),
})

export const session = pgTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: integer('user_id').notNull(),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
})

export const setting = pgTable('setting', {
	userId: integer('user_id').notNull(),
	qr_background: varchar('qr_background', { length: 7 }),
	qr_foreground: varchar('qr_foreground', { length: 7 }),
})

export * from './relations'
