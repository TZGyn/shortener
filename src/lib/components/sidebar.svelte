<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import ThemeToggle from './theme-toggle.svelte'
	import { Button } from '$lib/components/ui/button'
	import * as Avatar from '$lib/components/ui/avatar'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'

	import { User } from 'lucide-svelte'
	import { goto } from '$app/navigation'
</script>

<div class="min-w-[350px] p-4 border-r h-full flex flex-col justify-between">
	<div>
		<div class="flex justify-between pb-16 items-center">
			<div class="text-xl font-bold">Shortener</div>
			<ThemeToggle />
		</div>

		<div class="pb-4">Projects</div>
		<Separator />
	</div>
	<div class="flex justify-between items-center">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root>
					<Avatar.Image src="github.com/shadcn.png" alt="@shadcn" />
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
