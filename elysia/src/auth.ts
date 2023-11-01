import { nanoid } from 'nanoid'
import { db } from './database'

export const signup = async (
	email: string,
	username: string,
	password: string,
	password_confirm: string
) => {
	if (password !== password_confirm) {
		return { error: 'password is not the same' }
	}

	if (password.length < 8) {
		return { error: 'password should be at least length 8' }
	}

	try {
		await db
			.insertInto('user')
			.values({
				uuid: nanoid(16),
				email,
				username,
				password: await Bun.password.hash(password),
			})
			.execute()
		return { error: undefined }
	} catch (error) {
		console.log(error)
		return { error: 'error' }
	}
}

export const login = async (email: string, password: string) => {
	const userArray = await db
		.selectFrom('user')
		.selectAll()
		.where('user.email', '=', email)
		.execute()

	if (userArray.length < 1) {
		return { error: 'Invalid User' }
	}

	const user = userArray[0]

	if (await Bun.password.verify(password, user.password)) {
		return { user }
	} else {
		return { error: 'Incorrect Credentials' }
	}
}
