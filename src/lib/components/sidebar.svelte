<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import ThemeToggle from './theme-toggle.svelte'
	import { Button } from '$lib/components/ui/button'
	import * as Avatar from '$lib/components/ui/avatar'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'

	import { Loader2, User } from 'lucide-svelte'
	import { goto } from '$app/navigation'

	let dialogOpen = false
	let isLoading = false
	const logout = async () => {
		isLoading = true

		await fetch('/api/logout', { method: 'post' })

		isLoading = false
		dialogOpen = false
		goto('/login')
	}
</script>

<div class="flex h-full min-w-[350px] flex-col justify-between border-r p-4">
	<div>
		<div class="flex items-center justify-between pb-16">
			<div class="text-xl font-bold"><a href="/">Shortener</a></div>
			<ThemeToggle />
		</div>

		<div class="flex flex-col gap-4">
			<Button variant="ghost" href="/links" class="justify-start text-base"
				>Links</Button
			>
			<Button variant="ghost" href="/projects" class="justify-start text-base "
				>Projects</Button
			>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		<Separator />
		<div class="flex items-center justify-between">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Avatar.Root>
						<Avatar.Image src="" alt="@shadcn" />
						<Avatar.Fallback><User /></Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>My Account</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item on:click={() => goto('/profile')}
							>Profile</DropdownMenu.Item
						>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<div>
				<AlertDialog.Root bind:open={dialogOpen}>
					<AlertDialog.Trigger asChild let:builder>
						<Button variant="destructive" builders={[builder]} type="submit"
							>Sign Out</Button
						>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
							<AlertDialog.Description>
								You are about to log out of this account.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel disabled={isLoading}
								>Cancel</AlertDialog.Cancel
							>
							<Button on:click={logout} class="flex gap-2" disabled={isLoading}>
								{#if isLoading}
									<Loader2 class="animate-spin" />
								{/if}
								Log Out
							</Button>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>
		</div>
	</div>
</div>
