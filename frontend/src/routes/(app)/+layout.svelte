<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte'
	import type { PageData } from './$types'
	import * as Sheet from '$lib/components/ui/sheet'
	import { Button } from '$lib/components/ui/button'
	import { Menu } from 'lucide-svelte'
	import UserIcon from '$lib/components/UserIcon.svelte'
	import { Separator } from '$lib/components/ui/separator'
	import { Toaster } from '$lib/components/ui/sonner'

	export let data: PageData

	let sheetOpen = false

	const closeSheet = () => {
		sheetOpen = false
	}
</script>

<Toaster />
<div class="flex h-screen w-full">
	<Sidebar email={data.user.email} class="hidden lg:flex" />
	<div
		class="flex h-full max-h-screen w-full flex-col overflow-hidden">
		<div
			class="bg-background block w-full border-b px-4 py-2 lg:hidden">
			<Sheet.Root bind:open={sheetOpen}>
				<Sheet.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" class="p-2">
						<Menu />
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="flex flex-col">
					<Sheet.Header class="pb-16">
						<Sheet.Title>Shortener</Sheet.Title>
					</Sheet.Header>
					<div class="flex grow flex-col gap-4">
						<Button
							on:click={closeSheet}
							variant="ghost"
							href="/"
							class="justify-start text-base">Home</Button>
						<Button
							on:click={closeSheet}
							variant="ghost"
							href="/links"
							class="justify-start text-base">Links</Button>
						<Button
							on:click={closeSheet}
							variant="ghost"
							href="/projects"
							class="justify-start text-base ">Projects</Button>
					</div>
					<div class="flex flex-col justify-between">
						<div></div>
						<div class="flex flex-col gap-4">
							<Separator />
							<div class="flex items-center justify-between">
								<UserIcon
									email={data.user.email}
									onClick={closeSheet} />
							</div>
						</div>
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</div>
		<div class="flex h-full w-full flex-col overflow-hidden">
			<slot />
		</div>
	</div>
</div>
