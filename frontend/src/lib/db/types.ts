import type { InferSelectModel } from 'drizzle-orm'
import { project, shortener, user } from './schema'

export type User = InferSelectModel<typeof user>
export type Shortener = InferSelectModel<typeof shortener>
export type Project = InferSelectModel<typeof project>
