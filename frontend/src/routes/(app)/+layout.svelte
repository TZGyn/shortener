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

<div class="flex h-screen w-full flex-col">
	<div class="flex border-b">
		<div
			class="flex h-20 w-full items-center justify-between gap-6 p-4">
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

	<div class="flex h-full">
		<Sidebar class="hidden lg:flex" />
		<div
			class="flex h-full max-h-screen w-full flex-col overflow-hidden">
			<div
				class="block w-full border-b bg-background px-4 py-2 lg:hidden">
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
							<Button
								on:click={closeSheet}
								variant="ghost"
								href="/settings"
								class="justify-start text-base ">Settings</Button>
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
</div>
