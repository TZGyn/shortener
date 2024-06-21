<script lang="ts">
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import { Button } from '$lib/components/ui/button'

	function scrollIntoView({ target }) {
		const el = document.querySelector(target.getAttribute('href'))
		if (!el) return
		el.scrollIntoView({
			behavior: 'smooth',
		})
	}
</script>

<div class="flex flex-col items-center w-screen h-screen">
	<div class="flex justify-between py-4 px-8 w-full max-w-6xl">
		<div class="flex gap-4 items-center">
			<img src="/logo.png" alt="" class="h-8" />
			<div>kon.sh</div>
		</div>
		<div class="flex gap-8 items-center">
			<a href="/landing/docs">Docs</a>
			<a href="#pricing" on:click|preventDefault={scrollIntoView}
				>Pricing</a>
		</div>
		<div class="flex gap-4 items-center">
			<a
				href="/login"
				class="transition-all text-primary/80 hover:text-primary">
				Login
			</a>
			<Button
				href="/signup"
				class="bg-orange-400 hover:bg-orange-300 w-fit"
				>Get Started</Button>
			<ThemeToggle />
		</div>
	</div>
	<slot />
</div>
