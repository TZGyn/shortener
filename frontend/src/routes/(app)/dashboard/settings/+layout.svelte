<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import { Separator } from '$lib/components/ui/separator'
	import SidebarNav from './(components)/sidebar-nav.svelte'
</script>

<div class="flex h-auto flex-col overflow-hidden p-10">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Settings</h2>
		<p class="text-muted-foreground">Manage your account settings.</p>
	</div>
	<Separator class="my-4 lg:my-6" />
	<div
		class="grid h-auto w-full grid-cols-1 overflow-hidden xl:grid-cols-[1fr_minmax(auto,_700px)_1fr]">
		<aside
			class="flex w-full flex-grow border-b pb-4 xl:justify-end xl:border-none xl:pl-0">
			<SidebarNav />
		</aside>
		<div class="m-0 flex h-auto w-full flex-grow overflow-hidden p-0">
			<ScrollArea class="mt-0 w-full">
				<div class="w-full py-6 xl:px-8 xl:py-0">
					<slot />
				</div>
			</ScrollArea>
		</div>
		<div></div>
	</div>
</div>
