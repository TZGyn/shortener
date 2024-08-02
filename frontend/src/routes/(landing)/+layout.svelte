<script lang="ts">
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'

	function scrollIntoView({ target }: { target: any }) {
		const el = document.querySelector(target.getAttribute('href'))
		if (!el) return
		el.scrollIntoView({
			behavior: 'smooth',
		})
	}
</script>

<div class="flex h-screen w-screen flex-col items-center">
	<header class="flex w-full max-w-6xl justify-between px-8 py-4">
		<div class="flex items-center gap-4">
			<img src="/logo.png" alt="" class="h-8" />
			<div>kon.sh</div>
		</div>
		<div class="flex items-center gap-8">
			<a href="#features" on:click|preventDefault={scrollIntoView}>
				Features
			</a>
			<a href="#pricing" on:click|preventDefault={scrollIntoView}>
				Pricing
			</a>
		</div>
		<div class="flex items-center gap-4">
			<a
				href="/login"
				class="text-primary/80 hover:text-primary transition-all">
				Login
			</a>
			<Button
				href="/signup"
				class="w-fit bg-orange-400 hover:bg-orange-300">
				Get Started
			</Button>
			<ThemeToggle />
		</div>
	</header>
	<slot />
	<footer
		class="flex w-full max-w-6xl flex-col items-center justify-center gap-4 px-8 pb-8 pt-64">
		<div>Kon.sh - Url Shortener</div>
		<Separator />
		<nav class="w-full">
			<ul
				class="grid w-full grid-cols-[1fr_10px_1fr_10px_1fr] justify-items-center">
				<li>
					<a href="https://app.kon.sh">Kon.sh</a>
				</li>
				<Separator orientation={'vertical'} />
				<li>
					<a href="mailto:subsonic_module981@slmails.com">Contact</a>
				</li>
				<Separator orientation={'vertical'} />
				<li>
					<a href="https://kon.sh/AX0LqT-v" target="_blank">
						Report Bugs
					</a>
				</li>
			</ul>
		</nav>
	</footer>
</div>
