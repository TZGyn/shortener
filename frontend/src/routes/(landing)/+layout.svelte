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

<div class="flex h-screen w-screen flex-col items-center">
	<div class="flex w-full max-w-6xl justify-between px-8 py-4">
		<div class="flex items-center gap-4">
			<img src="/logo.png" alt="" class="h-8" />
			<div>kon.sh</div>
		</div>
		<div class="flex items-center gap-8">
			<a href="/landing/docs">Docs</a>
			<a href="#pricing" on:click|preventDefault={scrollIntoView}>
				Pricing
			</a>
		</div>
		<div class="flex items-center gap-4">
			<a
				href="/login"
				class="text-primary/80 transition-all hover:text-primary">
				Login
			</a>
			<Button
				href="/signup"
				class="w-fit bg-orange-400 hover:bg-orange-300">
				Get Started
			</Button>
			<ThemeToggle />
		</div>
	</div>
	<slot />
</div>
