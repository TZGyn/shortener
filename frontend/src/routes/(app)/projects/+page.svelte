<script lang="ts">
	import type { PageData } from './$types'
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Card from '$lib/components/ui/card'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { ExternalLink, Loader2, PlusCircle } from 'lucide-svelte'

	import { invalidateAll } from '$app/navigation'

	export let data: PageData

	let dialogOpen = false
	let inputProjectName = ''

	let isLoading = false

	const addShortener = async () => {
		isLoading = true

		const response = await fetch('/api/project', {
			method: 'post',
			body: JSON.stringify({ name: inputProjectName }),
		})

		const responseData = await response.json()

		isLoading = false

		if (responseData.success) {
			await invalidateAll()
			dialogOpen = false
		}
	}
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<div class="flex items-center justify-start p-4">
	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Trigger
			class={buttonVariants({ variant: 'default' }) + 'flex gap-2'}>
			<PlusCircle />
			Add Project
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Add Project</Dialog.Title>
				<Dialog.Description>
					Create A New Project Here. Click Add To Create.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right">Name</Label>
					<Input
						id="name"
						bind:value={inputProjectName}
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

{#if data.projects.length > 0}
	<div class="flex flex-wrap gap-4 overflow-scroll p-4">
		{#each data.projects as project}
			<a href={'/links?project=' + project.uuid}>
				<Card.Root
					class="w-[500px] hover:cursor-pointer hover:bg-secondary">
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							{project.name}
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="flex w-full justify-between">
							<Button
								class="flex h-8 items-center justify-center gap-1 rounded bg-secondary text-sm">
								<ExternalLink size={20} />
								{project.shortener.length}
								Shorteners
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			</a>
		{/each}
	</div>
{:else}
	<div>No Data</div>
{/if}
