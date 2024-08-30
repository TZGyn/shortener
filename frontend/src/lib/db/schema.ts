import {
	pgTable,
	serial,
	varchar,
	timestamp,
	integer,
	uuid,
	boolean,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const user = pgTable('user', {
	id: serial('id').primaryKey().notNull(),
	uuid: uuid('uuid').defaultRandom(),
	email_verified: boolean('email_verified').notNull().default(false),
	email: varchar('email', { length: 255 }).notNull().unique(),
	googleId: varchar('google_id', { length: 255 }),
	username: varchar('username', { length: 255 }),
	password: varchar('password', { length: 255 }),
	createdAt: timestamp('created_at', { mode: 'string' })
		.defaultNow()
		.notNull(),
	plan: varchar('plan', { length: 255 })
		.notNull()
		.$type<'free' | 'pro' | 'owner'>()
		.default('free'),
	stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
	qrCornerSquareStyle: varchar('qr_corner_square_style')
		.$type<'dot' | 'square' | 'extra-rounded'>()
		.notNull()
		.default('square'),
	qrDotStyle: varchar('qr_dot_style')
		.$type<'square' | 'rounded'>()
		.notNull()
		.default('square'),
})

export const shortener = pgTable('shortener', {
	id: serial('id').primaryKey().notNull(),
	link: varchar('link', { length: 255 }).notNull(),
	ios: boolean('ios').notNull().default(false),
	ios_link: varchar('ios_link', { length: 255 }),
	android: boolean('android').notNull().default(false),
	android_link: varchar('android_link', { length: 255 }),
	code: varchar('code', { length: 255 }).notNull().unique(),
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
	qr_background: varchar('qr_background', { length: 7 })
		.default('#ffffff')
		.notNull(),
	qr_foreground: varchar('qr_foreground', { length: 7 })
		.default('#000000')
		.notNull(),
	domain_status: varchar('domain_status', {
		length: 255,
	})
		.$type<'pending' | 'verified' | 'disabled'>()
		.notNull()
		.default('verified'),
	enable_custom_domain: boolean('enable_custom_domain')
		.notNull()
		.default(false),
	custom_ip: varchar('custom_ip', { length: 255 }),
	custom_domain_id: varchar('custom_domain_id', { length: 255 }),
	custom_domain: varchar('custom_domain', { length: 255 }),
	qrCornerSquareStyle: varchar('qr_corner_square_style')
		.$type<'dot' | 'square' | 'extra-rounded'>()
		.notNull()
		.default('square'),
	qrDotStyle: varchar('qr_dot_style')
		.$type<'square' | 'rounded'>()
		.notNull()
		.default('square'),
})

export const visitor = pgTable('visitor', {
	id: serial('id').primaryKey().notNull(),
	shortenerId: integer('shortener_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'date' })
		.defaultNow()
		.notNull(),
	countryCode: varchar('country_code', {
		length: 255,
	}).notNull(),
	country: varchar('country', { length: 255 }).notNull(),
	city: varchar('city', { length: 255 }).notNull(),
	deviceType: varchar('device_type', { length: 255 })
		.notNull()
		.default(''),
	deviceVendor: varchar('device_vendor', { length: 255 })
		.notNull()
		.default(''),
	os: varchar('os', { length: 255 }).notNull().default(''),
	browser: varchar('browser', { length: 255 }).notNull().default(''),
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

export const emailVerificationToken = pgTable(
	'email_verification_token',
	{
		id: varchar('id', { length: 255 }).primaryKey().notNull(),
		userId: integer('user_id').notNull(),
		email: varchar('email', { length: 255 }).notNull(),
		expiresAt: timestamp('expires_at', {
			withTimezone: true,
			mode: 'date',
		}).notNull(),
	},
)

// relations
export const userRelations = relations(user, ({ one, many }) => ({
	shortener: many(shortener),
	setting: one(setting),
}))

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

export const visitorRelations = relations(visitor, ({ one }) => ({
	shortener: one(shortener, {
		fields: [visitor.shortenerId],
		references: [shortener.id],
	}),
}))

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}))

export const settingRelations = relations(setting, ({ one }) => ({
	user: one(user, {
		fields: [setting.userId],
		references: [user.id],
	}),
}))
