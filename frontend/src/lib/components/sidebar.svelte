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
					.or(exactly('/links/').and(word)),
			),
			icon: Link,
		},
		{
			href: '/projects',
			name: 'Projects',
			regex: createRegExp(
				exactly('/projects')
					.at.lineStart()
					.or(exactly('/projects/').and(word)),
			),
			icon: Blocks,
		},
		{
			href: '/settings/account',
			name: 'Settings',
			regex: createRegExp(
				exactly('/settings')
					.at.lineStart()
					.or(exactly('/settings/').and(word)),
			),
			icon: Settings,
		},
	] as const
</script>

<div
	class={cn(
		'flex h-full min-w-[300px] flex-col justify-between border-r bg-muted/40',
		className,
	)}>
	<div>
		<div class="flex flex-col gap-4 p-4">
			{#each routes as route}
				<Button
					variant={route.regex.test($page.url.pathname)
						? 'secondary'
						: 'ghost'}
					href={route.href}
					class="flex gap-4 justify-start items-center text-base hover:bg-secondary/50">
					<svelte:component this={route.icon} class="w-4 h-4" />
					{route.name}
				</Button>
			{/each}
		</div>
	</div>
</div>
