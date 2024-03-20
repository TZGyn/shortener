<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import { Separator } from '$lib/components/ui/separator'
	import SidebarNav from './(components)/sidebar-nav.svelte'

	const sidebarNavItems = [
		{
			title: 'Account',
			href: '/settings/account',
		},
		{
			title: 'QR',
			href: '/settings/qr',
		},
	]
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<div class="flex h-auto flex-col overflow-hidden p-10">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Settings</h2>
		<p class="text-muted-foreground">
			Manage your account settings and set e-mail preferences.
		</p>
	</div>
	<Separator class="my-4 lg:my-6" />
	<div class="flex h-auto flex-col overflow-hidden lg:flex-row">
		<aside class="border-b pb-4 lg:w-1/5 lg:border-none">
			<SidebarNav items={sidebarNavItems} />
		</aside>
		<div
			class="m-0 flex h-auto w-full overflow-hidden p-0 lg:max-w-2xl">
			<ScrollArea class="mt-0 w-full">
				<div class="py-6 lg:px-8 lg:py-0">
					<slot />
				</div>
			</ScrollArea>
		</div>
	</div>
</div>
