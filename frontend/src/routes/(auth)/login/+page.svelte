<script lang="ts">
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import Form from './(components)/form.svelte'

	import type { PageData } from './$types'

	export let data: PageData
</script>

<div
	class="container relative flex-col justify-center items-center h-screen md:grid lg:grid-cols-2 lg:px-0 lg:max-w-none">
	<div class="absolute top-4 right-4 md:top-8 md:right-8">
		<ThemeToggle />
	</div>
	<div
		class="hidden relative flex-col p-10 h-full text-white lg:flex dark:border-r bg-primary-foreground">
		<div
			class="flex relative z-20 items-center text-lg font-medium text-primary">
			Shortener
		</div>
	</div>
	<div class="p-8">
		<div
			class="flex flex-col justify-center mx-auto space-y-6 w-full sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">
					Login to your account
				</h1>
				<p class="text-sm text-muted-foreground">
					Enter your email below to login to your account
				</p>
			</div>
			<Form data={data.form} />
			<p class="px-8 text-sm text-center text-muted-foreground">
				Don't Have An Account? Signup{' '}
				<a
					href="/signup"
					class="underline underline-offset-4 hover:text-primary">
					Here
				</a>
			</p>
		</div>
	</div>
</div>
