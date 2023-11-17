<script lang="ts">
	import type { PageData } from './$types'
	import { Separator } from '$lib/components/ui/separator'
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Card from '$lib/components/ui/card'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Loader2, PlusCircle } from 'lucide-svelte'
	import { invalidateAll } from '$app/navigation'

	export let data: PageData

	let dialogOpen = false
	let inputLink = ''
	let isLoading = false
	const addShortener = async () => {
		isLoading = true

		await fetch('/api/shortener', {
			method: 'post',
			body: JSON.stringify({ link: inputLink }),
		})

		isLoading = false
		await invalidateAll()
		dialogOpen = false
	}
	$: console.log(inputLink)
</script>

<div class="flex justify-between p-8">
	<div class="text-4xl font-bold">Links</div>
	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Trigger
			class={buttonVariants({ variant: 'default' }) + 'flex gap-2'}
		>
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
					<Input id="name" bind:value={inputLink} class="col-span-3" />
				</div>
			</div>
			<Dialog.Footer>
				<Button on:click={addShortener} class="flex gap-2">
					{#if isLoading}
						<Loader2 class="animate-spin" />
					{/if}
					Add</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
<Separator />

{#if data.shorteners.length > 0}
	<div class="flex flex-col gap-4 p-4">
		{#each data.shorteners as shortener}
			<Card.Root>
				<Card.Header>
					<Card.Title>{shortener.link}</Card.Title>
					<Card.Description>{shortener.code}</Card.Description>
				</Card.Header>
			</Card.Root>
		{/each}
	</div>
{:else}
	<div>No Data</div>
{/if}
