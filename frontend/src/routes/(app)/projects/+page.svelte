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

<div class="flex justify-start items-center p-4">
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
				<div class="grid grid-cols-4 gap-4 items-center">
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
	<div class="flex overflow-scroll flex-wrap gap-4 p-4">
		{#each data.projects as project}
			<a href={'/projects/' + project.uuid}>
				<Card.Root
					class="hover:cursor-pointer w-[500px] hover:bg-secondary">
					<Card.Header>
						<Card.Title class="flex gap-2 items-center">
							{project.name}
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="flex justify-between w-full">
							<Button
								class="flex gap-1 justify-center items-center h-8 text-sm rounded bg-secondary">
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
	<div class="flex flex-grow p-4">
		<div
			class="flex flex-1 justify-center items-center rounded-lg border border-dashed shadow-sm">
			<div class="flex flex-grow justify-center items-center w-full">
				<div class="flex flex-col gap-8 items-center">
					<div class="flex flex-col gap-2 items-center">
						<div class="text-4xl font-bold">No Project Found</div>
						<p class="text-muted-foreground">Add a new project</p>
					</div>
					<Button
						on:click={() => {
							dialogOpen = true
						}}
						class="w-fit">Add Project</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
