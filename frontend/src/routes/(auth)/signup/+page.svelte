<script lang="ts">
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import UserAuthForm from './(components)/user-auth-form.svelte'
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
					Create an account
				</h1>
				<p class="text-muted-foreground text-sm">
					Enter your email below to create your account
				</p>
			</div>
			<UserAuthForm />
			<p class="text-muted-foreground px-8 text-center text-sm">
				Already Have An Account? Login{' '}
				<a
					href="/login"
					class="hover:text-primary underline underline-offset-4">
					Here
				</a>{' '}
			</p>
		</div>
	</div>
</div>
