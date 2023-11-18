<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte'
	import type { PageData } from './$types'
	import * as Sheet from '$lib/components/ui/sheet'
	import { Button } from '$lib/components/ui/button'
	import { Menu } from 'lucide-svelte'
	import UserIcon from '$lib/components/UserIcon.svelte'
	import { Separator } from '$lib/components/ui/separator'

	export let data: PageData

	let sheetOpen = false

	const closeSheet = () => {
		sheetOpen = false
	}
</script>

<div class="flex h-screen w-full">
	<Sidebar email={data.user.email} class="hidden lg:flex" />
	<div class="h-full w-full">
		<div class="block w-full border-b px-4 py-2 lg:hidden">
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
								<UserIcon email={data.user.email} />
							</div>
						</div>
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</div>
		<div class="h-full w-full p-4">
			<slot />
		</div>
	</div>
</div>
