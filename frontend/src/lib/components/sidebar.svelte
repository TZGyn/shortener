<script lang="ts">
	import { page } from '$app/stores'
	import UserIcon from './UserIcon.svelte'

	import { Separator } from '$lib/components/ui/separator'
	import ThemeToggle from './theme-toggle.svelte'
	import { Button } from '$lib/components/ui/button'
	import { cn } from '$lib/utils'

	export let email: string = ''
	let className: string | undefined = undefined
	export { className as class }

	const routes = [
		{ href: '/', name: 'Home' },
		{ href: '/links', name: 'Links' },
		{ href: '/projects', name: 'Projects' },
		{ href: '/settings/account', name: 'Settings' },
	] as const
</script>

<div
	class={cn(
		'flex h-full min-w-[350px] flex-col justify-between border-r',
		className,
	)}>
	<div>
		<div class="flex h-20 items-center justify-between p-4">
			<div class="flex items-center justify-start gap-4">
				<UserIcon {email} />
				{email}
			</div>
			<ThemeToggle />
		</div>
		<Separator />

		<div class="flex flex-col gap-4 p-4">
			{#each routes as route}
				<Button
					variant={$page.url.pathname == route.href
						? 'secondary'
						: 'ghost'}
					href={route.href}
					class="justify-start text-base">{route.name}</Button>
			{/each}
		</div>
	</div>
</div>
