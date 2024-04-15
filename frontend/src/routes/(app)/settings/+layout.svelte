<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import { Separator } from '$lib/components/ui/separator'
	import SidebarNav from './(components)/sidebar-nav.svelte'
</script>

<div class="flex overflow-hidden flex-col p-10 h-auto">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Settings</h2>
		<p class="text-muted-foreground">Manage your account settings.</p>
	</div>
	<Separator class="my-4 lg:my-6" />
	<div class="flex overflow-hidden flex-col h-auto lg:flex-row">
		<aside class="pb-4 border-b lg:w-1/5 lg:border-none">
			<SidebarNav />
		</aside>
		<div
			class="flex overflow-hidden p-0 m-0 w-full h-auto lg:max-w-2xl">
			<ScrollArea class="mt-0 w-full">
				<div class="py-6 lg:py-0 lg:px-8">
					<slot />
				</div>
			</ScrollArea>
		</div>
	</div>
</div>
