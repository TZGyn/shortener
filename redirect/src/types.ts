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
}

export interface ShortenerTable {
	id: Generated<number>
	link: string
	code: string
	created_at: ColumnType<Date, string | undefined, never>
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
