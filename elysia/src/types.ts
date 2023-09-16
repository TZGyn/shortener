import { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface Database {
	shortener: ShortenerTable
}

export interface ShortenerTable {
	id: Generated<number>
	link: string
	code: string
}

export type Shortener = Selectable<ShortenerTable>
export type NewShortener = Insertable<ShortenerTable>
export type ShortenerUpdate = Updateable<ShortenerTable>
