<script lang="ts">
	import type { PageData } from './$types'
	import { Separator } from '$lib/components/ui/separator'
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Card from '$lib/components/ui/card'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import {
		BarChart,
		ExternalLink,
		Loader2,
		MoreVertical,
		PlusCircle,
	} from 'lucide-svelte'
	import { goto, invalidateAll } from '$app/navigation'

	export let data: PageData

	let dialogOpen = false
	let inputLink = ''
	let isLoading = false

	const addShortener = async () => {
		isLoading = true

		const response = await fetch('/api/shortener', {
			method: 'post',
			body: JSON.stringify({ link: inputLink }),
		})

		const responseData = await response.json()

		isLoading = false

		if (responseData.success) {
			await invalidateAll()
			dialogOpen = false
		}
	}

	let editDialogOpen = false
	let editShortenerCode = ''
	let editShortenerLink = ''
	let isEditLoading = false

	const openEditDialog = (code: string, link: string) => {
		editDialogOpen = true
		editShortenerCode = code
		editShortenerLink = link
	}

	const editShortener = async (code: string, link: string) => {
		isEditLoading = true
		await fetch(`/api/shortener/${code}`, {
			method: 'put',
			body: JSON.stringify({
				link,
			}),
		})
		await invalidateAll()
		isEditLoading = false
		editDialogOpen = false
	}

	const deleteShortener = async (code: string) => {
		await fetch(`/api/shortener/${code}`, {
			method: 'delete',
		})
		await invalidateAll()
	}
</script>

<div class="flex justify-between p-8">
	<div class="text-4xl font-bold">Links</div>
	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Trigger
			class={buttonVariants({ variant: 'default' }) + 'flex gap-2'}>
			<PlusCircle />
			Add Shortner
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Add Shortener</Dialog.Title>
				<Dialog.Description>
					Create A New Shortner Here. Click Add To Save.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right">Link</Label>
					<Input
						id="name"
						bind:value={inputLink}
						class="col-span-3" />
				</div>
			</div>
			<Dialog.Footer>
				<Button on:click={addShortener} class="flex gap-2">
					{#if isLoading}
						<Loader2 class="animate-spin" />
					{/if}
					Add
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
<Separator />

{#if data.shorteners.length > 0}
	<div class="flex flex-col gap-4 overflow-scroll p-4">
		{#each data.shorteners as shortener}
			<Card.Root class="w-full max-w-[500px]">
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<a
							href={'https://' +
								data.shortener_url +
								'/' +
								shortener.code}
							target="_blank"
							class="hover:underline">
							{data.shortener_url + '/' + shortener.code}
						</a>
						<ExternalLink size={16} />
					</Card.Title>
					<Card.Description>{shortener.link}</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="flex items-center justify-between">
						<div class="flex gap-2">
							<Button
								class="bg-secondary flex h-8 items-center justify-center gap-1 rounded text-sm"
								on:click={() => goto(`/links/${shortener.code}`)}>
								<BarChart size={20} />
								<div>
									{shortener.visitor.length} visits
								</div>
							</Button>
						</div>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<MoreVertical />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Group>
									<DropdownMenu.Item
										on:click={() =>
											openEditDialog(shortener.code, shortener.link)}>
										Edit
									</DropdownMenu.Item>
									<DropdownMenu.Item
										on:click={() => deleteShortener(shortener.code)}
										class="text-destructive data-[highlighted]:bg-destructive">
										Delete
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
{:else}
	<div>No Data</div>
{/if}

<Dialog.Root bind:open={editDialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Shortener {editShortenerCode}</Dialog.Title>
			<Dialog.Description>
				Edit Shortner Here. Click Save To Update.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label class="text-right">Link</Label>
				<Input
					id="name"
					bind:value={editShortenerLink}
					class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button
				on:click={() =>
					editShortener(editShortenerCode, editShortenerLink)}
				class="flex gap-2">
				{#if isEditLoading}
					<Loader2 class="animate-spin" />
				{/if}
				Save
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
