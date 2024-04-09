<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte'
	import type { PageData } from './$types'
	import * as Sheet from '$lib/components/ui/sheet'
	import { Button } from '$lib/components/ui/button'
	import { Menu } from 'lucide-svelte'
	import UserIcon from '$lib/components/UserIcon.svelte'
	import { Separator } from '$lib/components/ui/separator'
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import * as Breadcrumb from '$lib/components/ui/breadcrumb'
	import { page } from '$app/stores'

	export let data: PageData

	let sheetOpen = false

	const closeSheet = () => {
		sheetOpen = false
	}
</script>

<div
	class="flex overflow-hidden flex-col w-full h-screen max-h-screen max-w-screen">
	<div class="flex border-b bg-muted/40">
		<div
			class="flex gap-6 justify-between items-center py-2 px-4 w-full">
			<UserIcon email={data.user.email} />

			<div class="w-full">
				<Breadcrumb.Root>
					<Breadcrumb.List>
						{#if $page.data.breadcrumbs}
							{#each $page.data.breadcrumbs as breadcrumb, index}
								{#if index == $page.data.breadcrumbs.length - 1}
									<Breadcrumb.Item>
										<Breadcrumb.Page href={breadcrumb.path}>
											{breadcrumb.name}
										</Breadcrumb.Page>
									</Breadcrumb.Item>
								{:else}
									<Breadcrumb.Item>
										<Breadcrumb.Link href={breadcrumb.path}>
											{breadcrumb.name}
										</Breadcrumb.Link>
									</Breadcrumb.Item>
								{/if}
								{#if index != $page.data.breadcrumbs.length - 1}
									<Breadcrumb.Separator />
								{/if}
							{/each}
						{:else}
							<Breadcrumb.Item>
								<Breadcrumb.Link href={'/'}>Home</Breadcrumb.Link>
							</Breadcrumb.Item>
						{/if}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
			<ThemeToggle />
		</div>
	</div>

	<div
		class="block py-2 px-4 w-full border-b lg:hidden bg-background">
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
				<div class="flex flex-col gap-4 grow">
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
						class="justify-start text-base">Projects</Button>
					<Button
						on:click={closeSheet}
						variant="ghost"
						href="/settings"
						class="justify-start text-base">Settings</Button>
				</div>
				<div class="flex flex-col justify-between">
					<div></div>
					<div class="flex flex-col gap-4">
						<Separator />
						<div class="flex justify-between items-center">
							<UserIcon
								email={data.user.email}
								onClick={closeSheet} />
						</div>
					</div>
				</div>
			</Sheet.Content>
		</Sheet.Root>
	</div>

	<div class="flex overflow-hidden flex-grow">
		<Sidebar class="hidden lg:flex" />
		<div class="flex flex-col w-full h-auto">
			<slot />
		</div>
	</div>
</div>
