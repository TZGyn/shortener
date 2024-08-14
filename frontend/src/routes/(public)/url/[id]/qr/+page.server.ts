import { db } from '$lib/db'
import { redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'
import type { PageServerLoad } from './$types'

const shortenerUrl = env.PUBLIC_SHORTENER_URL

export const load = (async (event) => {
	const { id } = event.params
	const color = event.url.searchParams.get('color')

	const shortener = await db.query.shortener.findFirst({
		where: (shortener, { eq }) => eq(shortener.code, id),
		with: {
			user: {
				with: {
					setting: true,
				},
			},
			project: true,
		},
	})

	if (!shortener) {
		redirect(301, `/dashboard/links`)
	}

	let colorSetting: {
		color: { background: string | null; foreground: string | null }
	} | null = null
	if (color === 'true') {
		if (shortener.project) {
			colorSetting = {
				color: {
					background: shortener.project.qr_background,
					foreground: shortener.project.qr_foreground,
				},
			}
		} else if (shortener.user.setting) {
			colorSetting = {
				color: {
					background: shortener.user.setting.qr_background,
					foreground: shortener.user.setting.qr_foreground,
				},
			}
		}
	}

	const url =
		shortener.project && shortener.project.enable_custom_domain
			? shortener.project.custom_domain || shortenerUrl
			: shortenerUrl

	return { shortener, url, colorSetting, shortenerId: id }
}) satisfies PageServerLoad
