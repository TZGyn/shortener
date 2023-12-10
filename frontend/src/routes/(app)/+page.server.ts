import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { db } from '$lib/db'
import { sql } from 'drizzle-orm'

export const load = (async (event) => {
	const user = event.locals.userObject

	const projects = await db.query.project.findMany({
		with: {
			shortener: {
				with: {
					visitor: true,
				},
			},
		},
		where: (project, { eq }) => eq(project.userId, user.id),
	})

	const shorteners = await db.query.shortener.findMany({
		with: {
			visitor: true,
		},
		where: (shortener, { eq }) => eq(shortener.userId, user.id),
	})

	return { projects, shorteners }
}) satisfies PageServerLoad

export const actions = {
	signout: async (event) => {
		console.log('signout')
		event.cookies.delete('token')
		throw redirect(303, '/login')
	},
} satisfies Actions
