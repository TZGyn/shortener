<script lang="ts">
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import Form from './(components)/form.svelte'
	import { Button } from '$lib/components/ui/button'
	import { LoaderIcon } from 'lucide-svelte'
	import Google from '$lib/components/icons/google.svelte'

	let { data } = $props()

	let isLoading = $state(false)

	const loginGoogle = async () => {
		// isLoading = true
		// await fetch('/login/google')
		// isLoading = false
		window.location.href = '/login/google'
	}
</script>

<svelte:head>
	<link rel="canonical" href="https://app.kon.sh/signup" />
</svelte:head>

<div
	class="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
	<div class="absolute right-4 top-4 md:right-8 md:top-8">
		<ThemeToggle />
	</div>
	<div
		class="bg-primary-foreground relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
		<a href="/">
			<img src="/logo.png" alt="logo" class="h-12" />
		</a>
	</div>
	<div class="p-8">
		<div
			class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">
					Create an account
				</h1>
				<p class="text-muted-foreground text-sm">
					Enter your email below to create your account
				</p>
			</div>
			<Button variant="outline" onclick={loginGoogle}>
				{#if isLoading}
					<LoaderIcon class="mr-2 h-4 w-4 animate-spin" />
				{:else}
					<Google class="mr-2 h-4 w-4" />
				{/if}
				Signup with Google
			</Button>
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t" />
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-background text-muted-foreground px-2">
						Or continue with
					</span>
				</div>
			</div>
			<Form data={data.form} />
			<p class="text-muted-foreground px-8 text-center text-sm">
				Already Have An Account? Login{' '}
				<a
					href="/login"
					class="hover:text-primary underline underline-offset-4">
					Here
				</a>
				{' '}
			</p>
		</div>
	</div>
</div>
