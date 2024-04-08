<script lang="ts">
	import { page } from '$app/stores'
	import { Button } from '$lib/components/ui/button'
	import { cn } from '$lib/utils'
	import { createRegExp, exactly, word } from 'magic-regexp'

	let className: string | undefined = undefined
	export { className as class }

	const routes = [
		{
			href: '/',
			name: 'Home',
			regex: createRegExp(exactly('/').notBefore(word)),
		},
		{
			href: '/links',
			name: 'Links',
			regex: createRegExp(
				exactly('/links').or(exactly('/links/').before(word)),
			),
		},
		{
			href: '/projects',
			name: 'Projects',
			regex: createRegExp(
				exactly('/projects').or(exactly('/projects/').before(word)),
			),
		},
		{
			href: '/settings/account',
			name: 'Settings',
			regex: createRegExp(
				exactly('/settings').or(exactly('/settings/').before(word)),
			),
		},
	] as const
</script>

<div
	class={cn(
		'flex h-full min-w-[350px] flex-col justify-between border-r',
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
					class="justify-start text-base hover:bg-secondary/50"
					>{route.name}</Button>
			{/each}
		</div>
	</div>
</div>
