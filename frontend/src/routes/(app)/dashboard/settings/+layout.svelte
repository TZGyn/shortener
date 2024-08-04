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
	<div class="flex h-auto flex-col overflow-hidden lg:flex-row">
		<aside
			class="flex-grow border-b pb-4 lg:max-w-[200px] lg:border-none">
			<SidebarNav />
		</aside>
		<div class="m-0 flex h-auto flex-grow overflow-hidden p-0">
			<ScrollArea class="mt-0 w-full">
				<div class="w-full max-w-xl py-6 lg:px-8 lg:py-0">
					<slot />
				</div>
			</ScrollArea>
		</div>
	</div>
</div>
