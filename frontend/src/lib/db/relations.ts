import { relations } from 'drizzle-orm'
import {
	project,
	session,
	setting,
	shortener,
	user,
	visitor,
} from './schema'

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
