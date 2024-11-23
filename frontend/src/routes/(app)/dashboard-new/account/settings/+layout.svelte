<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import { Separator } from '$lib/components/ui/separator'
	import { ArrowLeftIcon } from 'lucide-svelte'
	import SidebarNav from './(components)/sidebar-nav.svelte'
</script>

<div class="flex h-auto flex-col overflow-hidden p-10">
	<div class="flex gap-2">
		<Button
			variant="outline"
			class="h-auto px-2"
			href="/dashboard-new/project/personal">
			<ArrowLeftIcon />
		</Button>
		<div class="space-y-0.5">
			<h2 class="text-2xl font-bold tracking-tight">Settings</h2>
			<p class="text-muted-foreground">
				Manage your account settings.
			</p>
		</div>
	</div>
	<Separator class="my-4" />
	<div class="flex h-auto w-full flex-col overflow-hidden">
		<aside class="flex flex-grow border-b pb-4">
			<SidebarNav />
		</aside>
		<div class="m-0 flex h-auto w-full flex-grow overflow-hidden p-0">
			<ScrollArea class="mt-0 w-full">
				<div class="w-full py-6">
					<slot />
				</div>
			</ScrollArea>
		</div>
		<div></div>
	</div>
</div>
