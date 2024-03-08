<script lang="ts">
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import { Button } from '$lib/components/ui/button'
	import Input from '$lib/components/ui/input/input.svelte'
	import Label from '$lib/components/ui/label/label.svelte'
	import { goto } from '$app/navigation'
	import { Loader2 } from 'lucide-svelte'
	import { toast } from 'svelte-sonner'

	let isLoading = false

	const guestLogin = async () => {
		isLoading = true
		const response = await fetch('/api/login', {
			method: 'post',
			body: JSON.stringify({
				email: 'test@example.com',
				password: 'password',
			}),
		})

		const data = await response.json()
		isLoading = false
		if (data.success) {
			toast.success('Successfully Logged In')
			goto('/')
		}
	}

	let email = ''
	let password = ''

	const userLogin = async () => {
		isLoading = true
		const response = await fetch('/api/login', {
			method: 'post',
			body: JSON.stringify({
				email,
				password,
			}),
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
		class="relative hidden h-full flex-col bg-primary-foreground p-10 text-white dark:border-r lg:flex">
		<div
			class="relative z-20 flex items-center text-lg font-medium text-primary">
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
				<p class="text-sm text-muted-foreground">
					Enter your email below to login to your account
				</p>
			</div>
			<div class="flex flex-col gap-4">
				<div class="flex w-full max-w-sm flex-col gap-2">
					<Label for="email">Email</Label>
					<Input
						type="email"
						id="email"
						placeholder="name@example.com"
						bind:value={email} />
				</div>
				<div class="flex w-full max-w-sm flex-col gap-2">
					<Label for="password">Password</Label>
					<Input
						type="password"
						id="password"
						placeholder="••••••••"
						bind:value={password} />
				</div>
				<Button
					disabled={isLoading}
					on:click={userLogin}
					class="flex items-center gap-2">
					{#if isLoading}
						<Loader2 class="animate-spin" />
					{/if}
					Login
				</Button>
			</div>
			<p class="px-8 text-center text-sm text-muted-foreground">
				Don't Have An Account? Signup{' '}
				<a
					href="/signup"
					class="underline underline-offset-4 hover:text-primary">
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
