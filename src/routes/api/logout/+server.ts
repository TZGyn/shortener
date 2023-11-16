import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	return new Response()
}

export const POST: RequestHandler = async (event) => {
	await new Promise((r) => setTimeout(r, 5000))
	return new Response('hello')
}
