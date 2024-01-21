<script lang="ts">
	import type { PageData } from './$types'
	import { Separator } from '$lib/components/ui/separator'
	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Card from '$lib/components/ui/card'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as Select from '$lib/components/ui/select'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Badge } from '$lib/components/ui/badge'
	import {
		BarChart,
		ExternalLink,
		Loader2,
		MoreVertical,
		QrCode,
	} from 'lucide-svelte'
	import { goto, invalidateAll } from '$app/navigation'
	import Qr from '$lib/components/QR.svelte'
	import AddShortenerDialog from './(component)/AddShortenerDialog.svelte'

	export let data: PageData

	let selectedProject: any = data.selected_project

	let dialogOpen = false

	let editDialogOpen = false
	let editShortenerCode = ''
	let editShortenerLink = ''
	let editShortenerCategory: any = undefined
	let isEditLoading = false

	const openEditDialog = (code: string, link: string) => {
		editDialogOpen = true
		editShortenerCode = code
		editShortenerLink = link
		editShortenerCategory = undefined
	}

	const editShortener = async (code: string, link: string) => {
		isEditLoading = true
		await fetch(`/api/shortener/${code}`, {
			method: 'put',
			body: JSON.stringify({
				link,
				projectId: editShortenerCategory
					? editShortenerCategory.value
					: undefined,
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

	let qrDialogOpen = false
	let qrCode = ''

	const openQRDialog = (code: string) => {
		qrCode = code
		qrDialogOpen = true
	}
</script>

<div class="flex min-h-[80px] items-center justify-between p-4">
	<div class="text-3xl font-bold">Links</div>
	<AddShortenerDialog {dialogOpen} />
</div>
<Separator />

<div class="p-4">
	<Select.Root portal={null} bind:selected={selectedProject}>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="Select a project" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Project</Select.Label>
				<a href={`/links`}>
					<Select.Item value={null} label={'None'}>None</Select.Item>
				</a>
				{#each data.projects as project}
					<a href={`/links?project=${project.uuid}`}>
						<Select.Item value={project.uuid} label={project.name}
							>{project.name}</Select.Item>
					</a>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="favoriteFruit" />
	</Select.Root>
</div>

{#if data.shorteners.length > 0}
	<div class="flex flex-wrap gap-4 overflow-scroll p-4">
		{#each data.shorteners as shortener}
			<Card.Root class="w-full max-w-[500px]">
				<Card.Header>
					<Card.Title class="flex items-center justify-between gap-2">
						<div class="flex items-center gap-2">
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
						</div>
						<Badge variant="default"
							>{shortener.project
								? shortener.project.name
								: 'Uncategorized'}</Badge>
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
							<Button
								class="bg-secondary flex h-8 items-center justify-center gap-1 rounded text-sm"
								on:click={() => openQRDialog(shortener.code)}>
								<QrCode size={20} />
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
			<div class="grid grid-cols-4 items-center gap-4">
				<Label class="text-right">Category</Label>
				<Select.Root
					bind:selected={editShortenerCategory}
					multiple={false}>
					<Select.Trigger class="col-span-3">
						<Select.Value placeholder="Select a Category" />
					</Select.Trigger>
					<Select.Content>
						{#each data.projects as project}
							<Select.Item value={project.id}
								>{project.name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
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

<Dialog.Root bind:open={qrDialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Shortener QR</Dialog.Title>
			<Dialog.Description>
				Use this QR code to share the shortener.
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex h-full flex-col items-center gap-4">
			<Badge variant="secondary">
				{data.shortener_url + '/' + qrCode}
			</Badge>
			<Qr
				value={data.shortener_url + '/' + qrCode}
				background={data.settings?.qr_background || '#fff'}
				color={data.settings?.qr_foreground || '#000'} />
		</div>
	</Dialog.Content>
</Dialog.Root>
