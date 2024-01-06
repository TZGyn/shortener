<script lang="ts">
	import type { PageData } from './$types'
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import UserAuthForm from './(components)/user-auth-form.svelte'
	import { Button } from '$lib/components/ui/button'
	import { goto } from '$app/navigation'
	import { Loader2 } from 'lucide-svelte'
	import { toast } from 'svelte-sonner'

	export let data: PageData
	let isLoading = false

	const guestLogin = async () => {
		isLoading = true
		const response = await fetch('/api/login', {
			method: 'post',
		})

		const data = await response.json()
		isLoading = false
		if (data.success) {
			toast.success('Successfully Logged In')
			goto('/')
		}
	}
</script>

<div
	class="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
	<div class="absolute right-4 top-4 md:right-8 md:top-8">
		<ThemeToggle />
	</div>
	<div
		class="bg-primary-foreground relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
		<div
			class="text-primary relative z-20 flex items-center text-lg font-medium">
			Shortener
		</div>
	</div>
	<div class="p-8">
		<div
			class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">
					Login to your account
				</h1>
				<p class="text-muted-foreground text-sm">
					Enter your email below to login to your account
				</p>
			</div>
			<UserAuthForm form={data.form} {isLoading} />
			<p class="text-muted-foreground px-8 text-center text-sm">
				Don't Have An Account? Signup{' '}
				<a
					href="/signup"
					class="hover:text-primary underline underline-offset-4">
					Here
				</a>
			</p>
			<Button
				disabled={isLoading}
				on:click={guestLogin}
				class="flex gap-2">
				{#if isLoading}
					<Loader2 class="animate-spin" />
				{/if}
				Login As Guest
			</Button>
		</div>
	</div>
</div>
