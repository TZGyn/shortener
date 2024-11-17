import { db } from '$lib/db'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { and, count, desc, eq, gt, gte, lte, sql } from 'drizzle-orm'
import { visitor as visitorSchema } from '$lib/db/schema'

export const load = (async (event) => {
	const user = event.locals.user
	const shortenerId = event.params.id

	const shortener = await db.query.shortener.findFirst({
		where: (shortener, { eq, and }) =>
			and(
				eq(shortener.id, shortenerId),
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

	let analyticsDate = new Date()
	analyticsDate.setHours(0)
	analyticsDate.setMinutes(0)
	analyticsDate.setSeconds(0)

	if (user.plan === 'free') {
	} else {
		analyticsDate.setMonth(analyticsDate.getMonth() - 23)
	}
	analyticsDate.setDate(1)

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
				gte(visitorSchema.createdAt, analyticsDate),
			),
		)
		.groupBy(sql`to_char(${visitorSchema.createdAt}, 'MM')`)

	const visitorAllTime = await db
		.select({ count: count() })
		.from(visitorSchema)
		.where(
			and(
				eq(visitorSchema.shortenerId, shortener.id),
				gte(visitorSchema.createdAt, analyticsDate),
			),
		)

	const visitorByCountry = db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			country: visitorSchema.country,
			code: visitorSchema.countryCode,
		})
		.from(visitorSchema)
		.where(
			and(
				eq(visitorSchema.shortenerId, shortener.id),
				gte(visitorSchema.createdAt, analyticsDate),
			),
		)
		.groupBy(visitorSchema.country, visitorSchema.countryCode)
		.orderBy(desc(sql<number>`cast(count(*) as int)`))

	const visitorByCity = db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			country: visitorSchema.country,
			code: visitorSchema.countryCode,
			city: visitorSchema.city,
		})
		.from(visitorSchema)
		.where(
			and(
				eq(visitorSchema.shortenerId, shortener.id),
				gte(visitorSchema.createdAt, analyticsDate),
			),
		)
		.groupBy(
			visitorSchema.country,
			visitorSchema.countryCode,
			visitorSchema.city,
		)
		.orderBy(desc(sql<number>`cast(count(*) as int)`))

	const visitorByOS = db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			os: visitorSchema.os,
		})
		.from(visitorSchema)
		.where(
			and(
				eq(visitorSchema.shortenerId, shortener.id),
				gte(visitorSchema.createdAt, analyticsDate),
			),
		)
		.groupBy(visitorSchema.os)
		.orderBy(desc(sql<number>`cast(count(*) as int)`))

	const visitorByBrowser = db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			browser: visitorSchema.browser,
		})
		.from(visitorSchema)
		.where(
			and(
				eq(visitorSchema.shortenerId, shortener.id),
				gte(visitorSchema.createdAt, analyticsDate),
			),
		)
		.groupBy(visitorSchema.browser)
		.orderBy(desc(sql<number>`cast(count(*) as int)`))

	const visitorByDeviceVendor = db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			vendor: visitorSchema.deviceVendor,
		})
		.from(visitorSchema)
		.where(
			and(
				eq(visitorSchema.shortenerId, shortener.id),
				gte(visitorSchema.createdAt, analyticsDate),
			),
		)
		.groupBy(visitorSchema.deviceVendor)
		.orderBy(desc(sql<number>`cast(count(*) as int)`))

	const visitorByDeviceType = db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			type: visitorSchema.deviceType,
		})
		.from(visitorSchema)
		.where(
			and(
				eq(visitorSchema.shortenerId, shortener.id),
				gte(visitorSchema.createdAt, analyticsDate),
			),
		)
		.groupBy(visitorSchema.deviceType)
		.orderBy(desc(sql<number>`cast(count(*) as int)`))

	const visitorByReferer = db
		.select({
			count: sql<number>`cast(count(*) as int)`,
			referer: visitorSchema.referer,
		})
		.from(visitorSchema)
		.where(
			and(
				eq(visitorSchema.shortenerId, shortener.id),
				gte(visitorSchema.createdAt, analyticsDate),
			),
		)
		.groupBy(visitorSchema.referer)
		.orderBy(desc(sql<number>`cast(count(*) as int)`))

	const last10Visitors = db.query.visitor.findMany({
		where: (visitor, { eq }) => eq(visitor.shortenerId, shortener.id),
		orderBy: (visitor, { desc }) => desc(visitor.createdAt),
		limit: 10,
	})

	const page_title = 'Shortener | ' + shortener.link

	const { breadcrumbs: parentBreadcrumbs } = await event.parent()

	const breadcrumbs = [
		...parentBreadcrumbs,
		{
			name: shortener.link,
			path: '/dashboard/links/' + shortener.id,
		},
	]

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
		visitorByReferer,
		last10Visitors,
		page_title,
		breadcrumbs,
	}
}) satisfies PageServerLoad
