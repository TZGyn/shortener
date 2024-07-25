import { db } from '$lib/db'
import type { RequestHandler } from './$types'
import QRCode from 'qrcode'
import { redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'

const shortenerUrl = env.PUBLIC_SHORTENER_URL

export const GET: RequestHandler = async (event) => {
	const shortenerId = event.params.id
	const color = event.url.searchParams.get('color')

	const shortener = await db.query.shortener.findFirst({
		where: (shortener, { eq }) => eq(shortener.code, shortenerId),
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
		redirect(303, '/')
	}

	let colorSetting = {}
	if (color === 'true') {
		if (shortener.project) {
			colorSetting = {
				color: {
					light: shortener.project.qr_background,
					dark: shortener.project.qr_foreground,
				},
			}
		} else if (shortener.user.setting) {
			colorSetting = {
				color: {
					light: shortener.user.setting.qr_background,
					dark: shortener.user.setting.qr_foreground,
				},
			}
		}
	}

	const url =
		shortener.project && shortener.project.enable_custom_domain
			? shortener.project.custom_domain || shortenerUrl
			: shortenerUrl

	const image = await QRCode.toBuffer(url + '/' + shortenerId, {
		type: 'png',
		errorCorrectionLevel: 'L',
		margin: 1,
		scale: 20,
		...colorSetting,
	})

	return new Response(image, {
		headers: {
			'Content-Type': 'image/png',
		},
	})
}
