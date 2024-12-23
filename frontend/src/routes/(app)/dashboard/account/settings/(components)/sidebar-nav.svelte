<script lang="ts">
	import { cn } from '$lib/utils'
	import { page } from '$app/stores'
	import { Button } from '$lib/components/ui/button'

	const items = [
		{
			title: 'Account',
			href: '/dashboard/account/settings/account',
		},
		{
			title: 'QR',
			href: '/dashboard/account/settings/qr',
		},
		{
			title: 'Security',
			href: '/dashboard/account/settings/security',
		},
	] as const
</script>

<nav class={cn('flex w-full max-w-[200px] space-x-2')}>
	{#each items as item}
		<Button
			href={item.href}
			variant={$page.url.pathname == item.href
				? 'secondary'
				: 'ghost'}
			class={cn(
				'hover:bg-secondary/50 text-muted-foreground justify-start',
				$page.url.pathname == item.href &&
					'text-secondary-foreground',
			)}>
			{item.title}
		</Button>
	{/each}
</nav>
