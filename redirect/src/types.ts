import {
	ColumnType,
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from 'kysely'

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface Database {
	shortener: ShortenerTable
	visitor: VisitorTable
	user: UserTable
	project: ProjectTable
}

export interface ShortenerTable {
	id: Generated<number>
	link: string
	ios: boolean
	ios_link: string | null
	android: boolean
	android_link: string | null
	code: string
	active: boolean
	created_at: ColumnType<Date, string | undefined, never>
	project_id: number | null
}

export type Shortener = Selectable<ShortenerTable>
export type NewShortener = Insertable<ShortenerTable>
export type ShortenerUpdate = Updateable<ShortenerTable>

export interface VisitorTable {
	id: Generated<number>
	shortener_id: number
	country: string
	country_code: string
	city: string
	device_type: string | null
	device_vendor: string | null
	os: string | null
	browser: string | null
	created_at: ColumnType<Date, string | undefined, never>
}

export type Visitor = Selectable<VisitorTable>
export type NewVisitor = Insertable<VisitorTable>

export interface UserTable {
	created_at: Generated<Timestamp>
	email: string
	id: Generated<number>
	password: string
	username: string
	uuid: string
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>

export interface ProjectTable {
	id: Generated<number>
	uuid: Generated<string>
	name: string
	userId: number
	custom_domain: string | null
	enable_custom_domain: boolean
}

export type Project = Selectable<ProjectTable>
export type NewProject = Insertable<ProjectTable>
export type ProjectUpdate = Updateable<ProjectTable>
