import { db } from '$lib/db'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { and, count, desc, eq, sql } from 'drizzle-orm'
import { visitor as visitorSchema } from '$lib/db/schema'

export const load = (async (event) => {
	const user = event.locals.user
	const shortenerId = event.params.id

	const shortener = await db.query.shortener.findFirst({
		where: (shortener, { eq, and }) =>
			and(
				eq(shortener.code, shortenerId),
				eq(shortener.userId, user.id),
			),
		with: {
			visitor: true,
		},
	})

	if (!shortener) {
		redirect(303, '/')
	}

	const now = new Date()

	const visitor = await db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			month: sql<number>`cast(to_char(${visitorSchema.createdAt}, 'MM') as int)`,
		})
		.from(visitorSchema)
		.where(
			and(
				eq(visitorSchema.shortenerId, shortener.id),
				sql`to_char(${
					visitorSchema.createdAt
				}, 'YYYY') = ${now.getFullYear()}`,
			),
		)
		.groupBy(sql`to_char(${visitorSchema.createdAt}, 'MM')`)

	const visitorAllTime = await db
		.select({ count: count() })
		.from(visitorSchema)
		.where(eq(visitorSchema.shortenerId, shortener.id))

	const visitorByCountry = await db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			country: visitorSchema.country,
			code: visitorSchema.countryCode,
		})
		.from(visitorSchema)
		.where(eq(visitorSchema.shortenerId, shortener.id))
		.groupBy(visitorSchema.country, visitorSchema.countryCode)
		.orderBy(desc(sql<number>`cast(count(*) as int)`))

	const visitorByCity = await db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			country: visitorSchema.country,
			code: visitorSchema.countryCode,
			city: visitorSchema.city,
		})
		.from(visitorSchema)
		.where(eq(visitorSchema.shortenerId, shortener.id))
		.groupBy(
			visitorSchema.country,
			visitorSchema.countryCode,
			visitorSchema.city,
		)
		.orderBy(desc(sql<number>`cast(count(*) as int)`))

	const visitorByOS = await db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			os: visitorSchema.os,
		})
		.from(visitorSchema)
		.where(eq(visitorSchema.shortenerId, shortener.id))
		.groupBy(visitorSchema.os)
		.orderBy(desc(sql<number>`cast(count(*) as int)`))

	const visitorByBrowser = await db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			browser: visitorSchema.browser,
		})
		.from(visitorSchema)
		.where(eq(visitorSchema.shortenerId, shortener.id))
		.groupBy(visitorSchema.browser)
		.orderBy(desc(sql<number>`cast(count(*) as int)`))

	const visitorByDeviceVendor = await db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			vendor: visitorSchema.deviceVendor,
		})
		.from(visitorSchema)
		.where(eq(visitorSchema.shortenerId, shortener.id))
		.groupBy(visitorSchema.deviceVendor)
		.orderBy(desc(sql<number>`cast(count(*) as int)`))

	const visitorByDeviceType = await db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			type: visitorSchema.deviceType,
		})
		.from(visitorSchema)
		.where(eq(visitorSchema.shortenerId, shortener.id))
		.groupBy(visitorSchema.deviceType)
		.orderBy(desc(sql<number>`cast(count(*) as int)`))

	const page_title = 'Shortener | ' + shortener.link

	return {
		shortener,
		visitor,
		visitorAllTime,
		visitorByCountry,
		visitorByCity,
		visitorByOS,
		visitorByBrowser,
		visitorByDeviceVendor,
		visitorByDeviceType,
		page_title,
	}
}) satisfies PageServerLoad
