<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import ThemeToggle from './theme-toggle.svelte'
	import { Button } from '$lib/components/ui/button'
	import * as Avatar from '$lib/components/ui/avatar'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'

	import { User } from 'lucide-svelte'
	import { goto } from '$app/navigation'
</script>

<div class="flex h-full min-w-[350px] flex-col justify-between border-r p-4">
	<div>
		<div class="flex items-center justify-between pb-16">
			<div class="text-xl font-bold">Shortener</div>
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
		<form method="post" action="?/signout">
			<Button variant="destructive" type="submit">Sign Out</Button>
		</form>
	</div>
</div>
