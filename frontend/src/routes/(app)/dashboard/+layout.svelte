<script lang="ts">
	import { page } from '$app/stores'
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import * as Avatar from '$lib/components/ui/avatar'
	import * as Breadcrumb from '$lib/components/ui/breadcrumb'
	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as Select from '$lib/components/ui/select/index.js'
	import {
		Blocks,
		CreditCardIcon,
		Home,
		Link,
		Settings,
		UserIcon,
	} from 'lucide-svelte'

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

	const routes = [
		{
			href: '/dashboard',
			name: 'Home',
			match: (path: string) => path === '/dashboard',
			icon: Home,
		},
		{
			href: '/dashboard/links',
			name: 'Links',
			match: (path: string) => path.startsWith('/dashboard/links'),
			icon: Link,
		},
		{
			href: '/dashboard/projects',
			name: 'Projects',
			match: (path: string) => path.startsWith('/dashboard/projects'),
			icon: Blocks,
		},
		{
			href: '/dashboard/billing',
			name: 'Billing',
			match: (path: string) => path.startsWith('/dashboard/billing'),
			icon: CreditCardIcon,
		},
		{
			href: '/dashboard/settings/account',
			name: 'Settings',
			match: (path: string) => path.startsWith('/dashboard/settings'),
			icon: Settings,
		},
	] as const
</script>

<div
	class="max-w-screen flex h-screen max-h-screen w-screen overflow-hidden">
	<div class="bg-muted/40 flex max-w-[300px] flex-col border-r">
		<div
			class="flex h-[60px] max-h-[60px] min-h-[60px] w-full items-center justify-center gap-4 border-b px-2 py-2 lg:px-4">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Avatar.Root>
						<Avatar.Image src="" alt="@shadcn" />
						<Avatar.Fallback><User /></Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>{data.user.email}</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							onclick={() => {
								goto('/dashboard/settings')
							}}>
							Settings
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							onclick={() => (dialogOpen = true)}
							class="text-destructive data-[highlighted]:bg-destructive">
							Log Out
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<div class="hidden w-full lg:flex">
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
		</div>

		<div
			class={'flex h-full flex-col justify-between lg:min-w-[300px]'}>
			<div>
				<div class="flex flex-col gap-4 p-2 lg:p-4">
					<Select.Root
						selected={{
							label: $page.data.project?.name || 'None',
							value: $page.data.project?.id || 'none',
						}}>
						<Select.Trigger class="hidden lg:flex">
							<Select.Value placeholder="Select a project" />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Projects</Select.Label>
								<Select.Separator />
								<a href={`/dashboard/links`}>
									<Select.Item value={'none'} label={'None'}>
										None
									</Select.Item>
								</a>
								<Select.Separator />
								{#each data.projects as project}
									<a href={`/dashboard/projects/${project.uuid}`}>
										<Select.Item
											value={project.id}
											label={project.name}>
											{project.name}
										</Select.Item>
									</a>
								{/each}
							</Select.Group>
						</Select.Content>
						<Select.Input name="favoriteFruit" />
					</Select.Root>
					{#each routes as route}
						<Button
							variant={route.match($page.url.pathname)
								? 'secondary'
								: 'ghost'}
							href={route.href}
							class="hover:bg-secondary/50 flex items-center justify-start gap-4 text-base">
							<route.icon class="h-4 w-4" />
							<div class="hidden lg:flex">
								{route.name}
							</div>
						</Button>
					{/each}
				</div>
			</div>
		</div>
		<div
			class="flex items-center justify-center border-t px-2 py-4 lg:justify-end lg:px-4">
			<ThemeToggle />
		</div>
	</div>

	<div class="flex flex-grow overflow-hidden">
		<div class="flex h-auto w-full flex-col">
			{@render children()}
		</div>
	</div>
</div>

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
