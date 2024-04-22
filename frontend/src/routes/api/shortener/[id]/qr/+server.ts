import { db } from '$lib/db'
import { project, setting, shortener, user } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'
import QRCode from 'qrcode'
import { redirect } from '@sveltejs/kit'

const shortenerUrl = Bun.env.PUBLIC_SHORTENER_URL ?? ''

export const GET: RequestHandler = async (event) => {
	const shortenerId = event.params.id
	const color = event.url.searchParams.get('color')
	const shortenerWithUserSetting = await db
		.select()
		.from(shortener)
		.where(eq(shortener.code, shortenerId))
		.leftJoin(user, eq(shortener.userId, user.id))
		.leftJoin(setting, eq(setting.userId, user.id))

	if (shortenerWithUserSetting.length == 0) {
		redirect(303, '/')
	}

	let colorSetting = {}
	if (color === 'true') {
		if (shortenerWithUserSetting[0].shortener.projectId) {
			const selectedProject = await db
				.select()
				.from(project)
				.where(
					eq(
						project.id,
						shortenerWithUserSetting[0].shortener.projectId,
					),
				)
			colorSetting = {
				color: {
					light: selectedProject[0].qr_background,
					dark: selectedProject[0].qr_foreground,
				},
			}
		} else if (shortenerWithUserSetting[0].setting) {
			colorSetting = {
				color: {
					light: shortenerWithUserSetting[0].setting.qr_background,
					dark: shortenerWithUserSetting[0].setting.qr_foreground,
				},
			}
		}
	}

	const image = await QRCode.toBuffer(
		shortenerUrl + '/' + shortenerId,
		{
			type: 'png',
			errorCorrectionLevel: 'L',
			margin: 1,
			scale: 20,
			...colorSetting,
		},
	)

	return new Response(image, {
		headers: {
			'Content-Type': 'image/png',
		},
	})
}
