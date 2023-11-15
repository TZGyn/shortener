<script lang="ts">
	import type { PageData } from './$types'
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import UserAuthForm from './(components)/user-auth-form.svelte'
	import { Button } from '$lib/components/ui/button'
	import { goto } from '$app/navigation'

	export let data: PageData

	const guestLogin = async () => {
		const response = await fetch('/api/login', { method: 'post' })

		const data = await response.json()
		if (data.success) {
			goto('/')
		}
	}
</script>

<div
	class="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="absolute right-4 top-4 md:right-8 md:top-8">
		<ThemeToggle />
	</div>
	<div
		class="relative hidden h-full flex-col bg-primary-foreground p-10 text-white dark:border-r lg:flex"
	>
		<div
			class="relative z-20 flex items-center text-lg font-medium text-primary"
		>
			Shortener
		</div>
	</div>
	<div class="p-8">
		<div
			class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
		>
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">
					Login to your account
				</h1>
				<p class="text-sm text-muted-foreground">
					Enter your email below to login to your account
				</p>
			</div>
			<UserAuthForm form={data.form} />
			<p class="px-8 text-center text-sm text-muted-foreground">
				Don't Have An Account? Signup{' '}
				<a
					href="/signup"
					class="underline underline-offset-4 hover:text-primary"
				>
					Here
				</a>
			</p>
			<Button variant="ghost" on:click={guestLogin}>Guest</Button>
		</div>
	</div>
</div>
