import { google } from '$lib/server/auth'
import { generateState, generateCodeVerifier } from 'arctic'
import { serializeCookie } from 'oslo/cookie'
import { env } from '$env/dynamic/private'
import { redirect } from '@sveltejs/kit'

export const GET = async (event) => {
	const state = generateState()
	const codeVerifier = generateCodeVerifier()

	const url = await google.createAuthorizationURL(
		state,
		codeVerifier,
		{
			scopes: ['email', 'profile'],
		},
	)

	event.cookies.set('google_oauth_state', state, {
		httpOnly: true,
		secure: env.APP_ENV === 'prod',
		maxAge: 60 * 10, // 10 minutes
		path: '/',
		sameSite: 'lax',
	})

	event.cookies.set('google_oauth_code_verifier', codeVerifier, {
		httpOnly: true,
		secure: env.APP_ENV === 'prod',
		maxAge: 60 * 10, // 10 minutes
		path: '/',
		sameSite: 'lax',
	})

	return redirect(302, url.toString())
}
