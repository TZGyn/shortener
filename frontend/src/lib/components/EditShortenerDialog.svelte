<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Select from '$lib/components/ui/select'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Checkbox } from '$lib/components/ui/checkbox'
	import { Loader2 } from 'lucide-svelte'
	import type { PageData } from '../$types'
	import { invalidateAll } from '$app/navigation'

	let data: PageData
	export let editDialogOpen: boolean
	export let projects: typeof data.projects
	export let editShortenerCode: string
	export let editShortenerLink: string
	export let editShortenerCategory: any
	export let editShortenerActive: boolean
	let isEditLoading = false

	const editShortener = async (code: string, link: string) => {
		isEditLoading = true
		await fetch(`/api/shortener/${code}`, {
			method: 'put',
			body: JSON.stringify({
				link,
				projectId: editShortenerCategory
					? editShortenerCategory.value
					: undefined,
				active: editShortenerActive,
			}),
		})
		await invalidateAll()
		isEditLoading = false
		editDialogOpen = false
	}
</script>

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
			<div class="grid grid-cols-4 items-center gap-4">
				<Label class="text-right">Category</Label>
				<Select.Root
					bind:selected={editShortenerCategory}
					multiple={false}>
					<Select.Trigger class="col-span-3">
						<Select.Value placeholder="Select a Category" />
					</Select.Trigger>
					<Select.Content>
						{#each projects as project}
							<Select.Item value={project.id}
								>{project.name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<div></div>
				<div class="flex items-center gap-4">
					<Checkbox id="terms" bind:checked={editShortenerActive} />
					<Label
						for="terms"
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Active
					</Label>
				</div>
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
