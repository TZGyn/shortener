<script lang="ts">
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'
	import { GithubIcon, MailIcon } from 'lucide-svelte'

	function scrollIntoView({ target }: { target: any }) {
		const el = document.querySelector(target.getAttribute('href'))
		if (!el) return
		el.scrollIntoView({
			behavior: 'smooth',
		})
	}
</script>

<div class="flex h-screen w-screen flex-col items-center">
	<header class="grid w-full max-w-6xl grid-cols-3 px-8 py-4">
		<a href="/" class="flex items-center justify-start gap-4">
			<img src="/logo.png" alt="logo" class="h-8" />
			<div>kon.sh</div>
		</a>
		<div class="grid grid-cols-4 items-center">
			<div></div>
			<a href="/features" class="text-center">Features</a>
			<a href="/pricing" class="text-center">Pricing</a>
			<div></div>
		</div>
		<div class="flex items-center justify-end gap-4">
			<a
				href="/login"
				class="text-primary/80 hover:text-primary transition-all">
				Login
			</a>
			<Button
				href="/signup"
				class="bg-brand hover:bg-brand-hover w-fit">
				Get Started
			</Button>
			<ThemeToggle />
		</div>
	</header>
	<slot />
	<footer
		class="flex w-full max-w-6xl flex-col items-center justify-center gap-4 px-8 pb-4 pt-64">
		<div>Kon.sh - Url Shortener</div>
		<Separator />
		<nav class="w-full">
			<ul
				class="grid w-full grid-cols-[1fr_10px_1fr_10px_1fr_10px_1fr] justify-items-center">
				<li>
					<a href="https://app.kon.sh">Kon.sh</a>
				</li>
				<Separator orientation={'vertical'} />
				<li>
					<a
						href="mailto:subsonic_module981@slmails.com"
						class="flex items-center gap-2">
						<MailIcon />
						Contact
					</a>
				</li>
				<Separator orientation={'vertical'} />
				<li>
					<a
						href="https://kon.sh/AX0LqT-v"
						target="_blank"
						class="flex items-center gap-2">
						<GithubIcon />
						Report Bugs
					</a>
				</li>
				<Separator orientation={'vertical'} />
				<li>
					<a
						href="https://kon.sh/github"
						target="_blank"
						class="flex items-center gap-2">
						<GithubIcon />
						GitHub
					</a>
				</li>
			</ul>
		</nav>
	</footer>
</div>
