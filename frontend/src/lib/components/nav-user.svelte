<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import * as Sidebar from '$lib/components/ui/sidebar/index.js'
	import { useSidebar } from '$lib/components/ui/sidebar/index.js'
	import { Loader2Icon, UserIcon } from 'lucide-svelte'
	import BadgeCheck from 'lucide-svelte/icons/badge-check'
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down'
	import CreditCard from 'lucide-svelte/icons/credit-card'
	import LogOut from 'lucide-svelte/icons/log-out'
	import Sparkles from 'lucide-svelte/icons/sparkles'
	import { toast } from 'svelte-sonner'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Button } from '$lib/components/ui/button'

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

	let {
		user,
	}: {
		user: {
			name: string
			email: string
			avatar: string
			isPro: boolean
		}
	} = $props()
	import { goto } from '$app/navigation'
	const sidebar = useSidebar()
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}>
						<Avatar.Root class="h-8 w-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">
								<UserIcon />
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
						<ChevronsUpDown class="size-4 ml-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="min-w-56 w-[--bits-dropdown-menu-anchor-width] rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}>
				<DropdownMenu.Label class="p-0 font-normal">
					<div
						class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="h-8 w-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">
								<UserIcon />
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				{#if !user.isPro}
					<DropdownMenu.Group>
						<a href="/dashboard/billing/plan/pro">
							<DropdownMenu.Item>
								<Sparkles />
								Upgrade to Pro
							</DropdownMenu.Item>
						</a>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
				{/if}
				<DropdownMenu.Group>
					<a href="/dashboard/settings/account">
						<DropdownMenu.Item>
							<BadgeCheck />
							Account
						</DropdownMenu.Item>
					</a>
					<a href="/dashboard/billing">
						<DropdownMenu.Item>
							<CreditCard />
							Billing
						</DropdownMenu.Item>
					</a>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					onclick={() => (dialogOpen = true)}
					class="text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-white">
					<LogOut />
					Log out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>

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
						<Loader2Icon class="animate-spin" />
					{/if}
					Log Out
				</Button>
			</div>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
