<script lang="ts">
	import { page } from '$app/stores'
	import { Button } from '$lib/components/ui/button'
	import { cn } from '$lib/utils'
	import { Blocks, Home, Link, Settings } from 'lucide-svelte'

	let className: string | undefined = undefined
	export { className as class }

	const routes = [
		{
			href: '/dashboard',
			name: 'Home',
			match: (path: string) => path === '/dashboard',
			icon: Home,
		},
		{
			href: '/dashboard/links',
			name: 'Links',
			match: (path: string) => path.startsWith('/dashboard/links'),
			icon: Link,
		},
		{
			href: '/dashboard/projects',
			name: 'Projects',
			match: (path: string) => path.startsWith('/dashboard/projects'),
			icon: Blocks,
		},
		{
			href: '/dashboard/settings/account',
			name: 'Settings',
			match: (path: string) => path.startsWith('/dashboard/settings'),
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
					variant={route.match($page.url.pathname)
						? 'secondary'
						: 'ghost'}
					href={route.href}
					class="hover:bg-secondary/50 flex items-center justify-start gap-4 text-base">
					<svelte:component this={route.icon} class="h-4 w-4" />
					<div class="hidden lg:flex">
						{route.name}
					</div>
				</Button>
			{/each}
		</div>
	</div>
</div>
