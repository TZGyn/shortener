import { z } from 'zod'
import { char, createRegExp, exactly, oneOrMore } from 'magic-regexp'

const urlRegex = createRegExp(
	exactly('https://'),
	oneOrMore(oneOrMore(char), exactly('.')),
	oneOrMore(char)
)

export const createLinkSchema = z.object({
	link: z.string().regex(urlRegex),
})
