import {
	pgTable,
	serial,
	varchar,
	timestamp,
	integer,
	uuid,
} from 'drizzle-orm/pg-core'

import { relations, type InferSelectModel } from 'drizzle-orm'

export const shortener = pgTable('shortener', {
	id: serial('id').primaryKey().notNull(),
	link: varchar('link', { length: 255 }).notNull(),
	code: varchar('code', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' })
		.defaultNow()
		.notNull(),
	userId: integer('user_id').notNull(),
	projectId: integer('project_id'),
})

export const shortenerRelations = relations(
	shortener,
	({ one, many }) => ({
		user: one(user, {
			fields: [shortener.userId],
			references: [user.id],
		}),
		project: one(project, {
			fields: [shortener.projectId],
			references: [project.id],
		}),
		visitor: many(visitor),
	}),
)

export const project = pgTable('project', {
	id: serial('id').primaryKey().notNull(),
	uuid: uuid('uuid').defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	userId: integer('user_id').notNull(),
})

export const projectRelations = relations(
	project,
	({ one, many }) => ({
		user: one(user, {
			fields: [project.userId],
			references: [user.id],
		}),
		shortener: many(shortener),
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

export type User = InferSelectModel<typeof user>

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

export const setting = pgTable('setting', {
	userId: integer('user_id').notNull(),
	qr_background: varchar('qr_background', { length: 7 }),
	qr_foreground: varchar('qr_foreground', { length: 7 }),
})

export const settingRelations = relations(setting, ({ one }) => ({
	user: one(user, {
		fields: [setting.userId],
		references: [user.id],
	}),
}))
