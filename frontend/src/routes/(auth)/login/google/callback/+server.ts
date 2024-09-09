import { OAuth2RequestError } from 'arctic'
import { google, lucia } from '$lib/server/auth'
import { db } from '$lib/db'
import { user } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'

interface GoogleUser {
	sub: string // Unique identifier for the user
	name: string // Full name of the user
	email: string // Email address of the user
}

export async function GET(event) {
	const code = event.url.searchParams.get('code')
	const state = event.url.searchParams.get('state')
	const codeVerifier = event.cookies.get('google_oauth_code_verifier')
	const storedState = event.cookies.get('google_oauth_state') ?? null

	if (
		!code ||
		!state ||
		!storedState ||
		!codeVerifier ||
		state !== storedState
	) {
		return new Response(null, {
			status: 400,
		})
	}

	try {
		const tokens = await google.validateAuthorizationCode(
			code,
			codeVerifier,
		)
		const googleUserResponse = await fetch(
			'https://www.googleapis.com/oauth2/v3/userinfo',
			{
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`,
				},
			},
		)
		const googleUser: GoogleUser = await googleUserResponse.json()

		const existingGoogleUser = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.googleId, googleUser.sub),
		})

		if (existingGoogleUser) {
			const session = await lucia.createSession(
				existingGoogleUser.id,
				{},
			)
			const sessionCookie = lucia.createSessionCookie(session.id)
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			})

			return new Response(null, {
				status: 302,
				headers: {
					Location: '/dashboard',
				},
			})
		}

		const existingUser = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.email, googleUser.email),
		})

		if (existingUser) {
			const updateUser = await db
				.update(user)
				.set({
					email_verified: true,
					password: null,
					username: googleUser.name,
				})
				.where(eq(user.id, existingUser.id))
				.returning()

			const newUser = updateUser[0]

			const session = await lucia.createSession(newUser.id, {})
			const sessionCookie = lucia.createSessionCookie(session.id)
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			})
		} else {
			const insertUser = await db
				.insert(user)
				.values({
					id: generateId(8),
					email: googleUser.email, // Using email as username
					email_verified: true,
					googleId: googleUser.sub,
					username: googleUser.name, // Name field may not always be present, handle accordingly
				})
				.returning()

			const newUser = insertUser[0]

			const session = await lucia.createSession(newUser.id, {})
			const sessionCookie = lucia.createSessionCookie(session.id)
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			})
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/dashboard',
			},
		})
	} catch (e) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/login',
			},
		})
	}
}
