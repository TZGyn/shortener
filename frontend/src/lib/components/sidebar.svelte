<script lang="ts">
	import { page } from '$app/stores'
	import { Button } from '$lib/components/ui/button'
	import { cn } from '$lib/utils'
	import { Blocks, Home, Link, Settings } from 'lucide-svelte'
	import { createRegExp, exactly, word } from 'magic-regexp'

	let className: string | undefined = undefined
	export { className as class }

	const routes = [
		{
			href: '/',
			name: 'Home',
			regex: createRegExp(exactly('/').notBefore(word)),
			icon: Home,
		},
		{
			href: '/links',
			name: 'Links',
			regex: createRegExp(
				exactly('/links')
					.at.lineStart()
					.or(exactly('/links/').notBefore(word).and(word)),
			),
			icon: Link,
		},
		{
			href: '/projects',
			name: 'Projects',
			regex: createRegExp(
				exactly('/projects')
					.at.lineStart()
					.or(exactly('/projects/').notBefore(word).and(word)),
			),
			icon: Blocks,
		},
		{
			href: '/settings/account',
			name: 'Settings',
			regex: createRegExp(
				exactly('/settings')
					.at.lineStart()
					.or(exactly('/settings/').notBefore(word).and(word)),
			),
			icon: Settings,
		},
	] as const
</script>

<div
	class={cn(
		'flex h-full flex-col justify-between lg:min-w-[300px]',
		className,
	)}>
	<div>
		<div class="flex flex-col gap-4 p-2 lg:p-4">
			{#each routes as route}
				<Button
					variant={route.regex.test($page.url.pathname)
						? 'secondary'
						: 'ghost'}
					href={route.href}
					class="flex items-center justify-start gap-4 text-base hover:bg-secondary/50">
					<svelte:component this={route.icon} class="h-4 w-4" />
					<div class="hidden lg:flex">
						{route.name}
					</div>
				</Button>
			{/each}
		</div>
	</div>
</div>
