<script lang="ts">
	import { cn } from '$lib/utils'
	import { page } from '$app/stores'
	import { Button } from '$lib/components/ui/button'
	let className: string | undefined | null = undefined
	export { className as class }

	const items = [
		{
			title: 'Account',
			href: '/settings/account',
		},
		{
			title: 'QR',
			href: '/settings/qr',
		},
	] as const
</script>

<nav
	class={cn(
		'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
		className,
	)}>
	{#each items as item}
		<Button
			href={item.href}
			variant={$page.url.pathname == item.href
				? 'secondary'
				: 'ghost'}
			class="justify-start hover:bg-secondary/50">
			{item.title}
		</Button>
	{/each}
</nav>
