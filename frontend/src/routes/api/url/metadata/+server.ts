import { z } from 'zod'
import type { RequestHandler } from './$types'
import { parse } from 'node-html-parser'
import he from 'he'

export const GET: RequestHandler = async (event) => {
	const url = event.url.searchParams.get('url')

	if (!url || !z.string().url().safeParse(url).success) {
		return new Response(
			JSON.stringify({
				title: url,
				description: 'No description',
				image: null,
			}),
		)
	}
	// taken from https://github.com/dubinc/dub/blob/main/apps/web/app/api/edge/metatags/utils.ts
	try {
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'shortener-bot',
			},
		})
		if (!response) {
			return new Response(
				JSON.stringify({
					title: url,
					description: 'No description',
					image: null,
				}),
			)
		}
		const html = await response.text()
		const ast = parse(html)
		const metaTags = ast
			.querySelectorAll('meta')
			.map(({ attributes }) => {
				const property =
					attributes.property || attributes.name || attributes.href
				return {
					property,
					content: attributes.content,
				}
			})
		const titleTag = ast.querySelector('title')?.innerText
		const linkTags = ast
			.querySelectorAll('link')
			.map(({ attributes }) => {
				const { rel, href } = attributes
				return {
					rel,
					href,
				}
			})

		let object: any = {}

		for (let k in metaTags) {
			let { property, content } = metaTags[k]

			property && (object[property] = content && he.decode(content))
		}

		for (let m in linkTags) {
			let { rel, href } = linkTags[m]

			rel && (object[rel] = href)
		}

		const title =
			object['og:title'] || object['twitter:title'] || titleTag

		const description =
			object['description'] ||
			object['og:description'] ||
			object['twitter:description']

		const image =
			object['og:image'] ||
			object['twitter:image'] ||
			object['image_src'] ||
			object['icon'] ||
			object['shortcut icon']

		return new Response(
			JSON.stringify({
				title: title || url,
				description: description || 'No description',
				image: getRelativeUrl(url, image),
			}),
		)
	} catch (error) {
		return new Response(
			JSON.stringify({
				title: url,
				description: 'No description',
				image: null,
			}),
		)
	}
}

const getRelativeUrl = (url: string, imageUrl: string) => {
	if (!imageUrl) {
		return null
	}
	if (z.string().url().safeParse(imageUrl).success) {
		return imageUrl
	}
	const { protocol, host } = new URL(url)
	const baseURL = `${protocol}//${host}`
	return new URL(imageUrl, baseURL).toString()
}
