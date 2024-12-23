<script lang="ts">
	import { page } from '$app/stores'
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import * as Breadcrumb from '$lib/components/ui/breadcrumb'
	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import { UserIcon } from 'lucide-svelte'
	import AppSidebar from './(components)/app-sidebar.svelte'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import * as Sidebar from '$lib/components/ui/sidebar/index.js'

	import { goto } from '$app/navigation'
	import { Loader2, User } from 'lucide-svelte'
	import { toast } from 'svelte-sonner'

	let dialogOpen = $state(false)
	let isLoading = $state(false)

	const logout = async () => {
		isLoading = true

		await fetch('/api/logout', { method: 'post' })

		isLoading = false
		dialogOpen = false
		toast.success('Logged Out Successfully')
		goto('/login')
	}

	let { data, children } = $props()
</script>

<Sidebar.Provider>
	<AppSidebar
		activeProject={data.activeProject}
		user={data.user}
		projects={data.projects}
		createProjectForm={data.form} />
	<Sidebar.Inset>
		<header
			class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					{#each $page.data.breadcrumbs as breadcrumb, index}
						{#if index == $page.data.breadcrumbs.length - 1}
							<Breadcrumb.Item>
								<Breadcrumb.Page>
									{breadcrumb.name}
								</Breadcrumb.Page>
							</Breadcrumb.Item>
						{:else}
							<Breadcrumb.Item class="hidden md:block">
								<Breadcrumb.Link href={breadcrumb.path}>
									{breadcrumb.name}
								</Breadcrumb.Link>
							</Breadcrumb.Item>
							<Breadcrumb.Separator class="hidden md:block" />
						{/if}
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>

		<div
			class="flex max-h-[calc(100vh-64px)] flex-grow overflow-hidden">
			<div class="flex h-auto w-full flex-col">
				{@render children()}
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		<Dialog.Header class="space-y-12">
			<div
				class="flex w-full flex-col items-center justify-center gap-6 pt-12">
				<div class="bg-destructive/30 w-fit rounded-full p-4">
					<UserIcon class="text-destructive" size={64} />
				</div>
			</div>
			<div class="space-y-2">
				<Dialog.Title class="text-center">Log Out?</Dialog.Title>
				<Dialog.Description class="text-center">
					You are about to log out of this account.
				</Dialog.Description>
			</div>
			<div class="flex justify-center gap-6">
				<Button
					variant="outline"
					class="w-full"
					onclick={() => {
						dialogOpen = false
					}}
					disabled={isLoading}>
					Cancel
				</Button>
				<Button
					variant="destructive"
					onclick={logout}
					class="flex w-full gap-2"
					disabled={isLoading}>
					{#if isLoading}
						<Loader2 class="animate-spin" />
					{/if}
					Log Out
				</Button>
			</div>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
