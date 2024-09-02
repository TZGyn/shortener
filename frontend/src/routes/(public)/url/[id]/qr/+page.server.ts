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
			user: true,
			project: true,
		},
	})

	if (!shortener) {
		redirect(302, `/dashboard/links`)
	}

	let setting: {
		color: { background: string | null; foreground: string | null }
		cornerSquareType: 'square' | 'dot' | 'extra-rounded'
		dotStyle: 'square' | 'rounded'
		image: string | null
	} | null = null
	if (color === 'true') {
		if (shortener.project) {
			setting = {
				color: {
					background: shortener.project.qr_background,
					foreground: shortener.project.qr_foreground,
				},
				cornerSquareType: shortener.project.qrCornerSquareStyle,
				dotStyle: shortener.project.qrDotStyle,
				image: shortener.project.qrImageBase64,
			}
		} else if (shortener.user) {
			setting = {
				color: {
					background: shortener.user.qrBackground,
					foreground: shortener.user.qrForeground,
				},
				cornerSquareType: shortener.user.qrCornerSquareStyle,
				dotStyle: shortener.user.qrDotStyle,
				image: shortener.user.qrImageBase64,
			}
		}
	}

	const url =
		shortener.project && shortener.project.enable_custom_domain
			? shortener.project.custom_domain || shortenerUrl
			: shortenerUrl

	return { shortener, url, setting, shortenerId: id }
}) satisfies PageServerLoad
