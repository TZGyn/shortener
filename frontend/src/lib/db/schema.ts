import {
	pgTable,
	serial,
	varchar,
	timestamp,
	integer,
	uuid,
} from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

export const shortener = pgTable('shortener', {
	id: serial('id').primaryKey().notNull(),
	link: varchar('link', { length: 255 }).notNull(),
	code: varchar('code', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' })
		.defaultNow()
		.notNull(),
	userId: integer('user_id').notNull(),
})

export const shortenerRelations = relations(
	shortener,
	({ one, many }) => ({
		user: one(user, {
			fields: [shortener.userId],
			references: [user.id],
		}),
		visitor: many(visitor),
	}),
)

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
})

export const visitorRelations = relations(visitor, ({ one }) => ({
	shortener: one(shortener, {
		fields: [visitor.shortenerId],
		references: [shortener.id],
	}),
}))

export const session = pgTable('session', {
	token: varchar('token', { length: 255 }).notNull(),
	userId: integer('user_id').notNull(),
	expiresAt: timestamp('expires', {
		mode: 'date',
	}).notNull(),
})

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}))
