import {
	ColumnType,
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from 'kysely'

export interface Database {
	shortener: ShortenerTable
	visitor: VisitorTable
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
	country_code: string
	created_at: ColumnType<Date, string | undefined, never>
}

export type Visitor = Selectable<VisitorTable>
export type NewVisitor = Insertable<VisitorTable>
