import type { RequestHandler } from './$types'
import QRCode from 'qrcode'

const shortenerUrl = Bun.env.PUBLIC_SHORTENER_URL ?? 'shortener.url'

export const GET: RequestHandler = async (event) => {
	const shortenerId = event.params.id
	const image = await QRCode.toBuffer(
		shortenerUrl + '/' + shortenerId,
		{ type: 'png', errorCorrectionLevel: 'L', margin: 1, scale: 20 },
	)

	return new Response(image, {
		headers: {
			'Content-Type': 'image/png',
		},
	})
}
