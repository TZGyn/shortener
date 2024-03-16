<script lang="ts">
	import type { PageData } from './$types'
	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Card from '$lib/components/ui/card'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as Select from '$lib/components/ui/select'
	import * as Command from '$lib/components/ui/command'
	import * as Popover from '$lib/components/ui/popover'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Badge } from '$lib/components/ui/badge'
	import { Checkbox } from '$lib/components/ui/checkbox'
	import {
		BarChart,
		ExternalLink,
		Loader2,
		MoreVertical,
		QrCode,
		Check,
		ChevronsUpDown,
	} from 'lucide-svelte'
	import { invalidateAll } from '$app/navigation'
	import { cn } from '$lib/utils'
	import Qr from '$lib/components/QR.svelte'
	import AddShortenerDialog from './(component)/AddShortenerDialog.svelte'
	import { toast } from 'svelte-sonner'
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'

	export let data: PageData

	let dialogOpen = false

	let editDialogOpen = false
	let editShortenerCode = ''
	let editShortenerLink = ''
	let editShortenerCategory: any = undefined
	let editShortenerActive = false
	let isEditLoading = false

	let open: boolean = false
	let selectedProject: any = data.selected_project.label

	$: selectedProject = data.selected_project.label

	const openEditDialog = (
		code: string,
		link: string,
		projectId: number | null,
		projectName: string | undefined,
		active: boolean,
	) => {
		editDialogOpen = true
		editShortenerCode = code
		editShortenerLink = link
		editShortenerActive = active
		if (projectId) {
			editShortenerCategory = { value: projectId, label: projectName }
		} else {
			editShortenerCategory = undefined
		}
	}

	const editShortener = async (code: string, link: string) => {
		isEditLoading = true
		console.log(editShortenerCategory)
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

	let deleteDialogOpen = false
	let deleteShortenerCode = ''
	let isDeleteLoading = false
	const openDeleteDialog = (code: string) => {
		deleteShortenerCode = code
		deleteDialogOpen = true
	}

	const deleteShortener = async () => {
		isDeleteLoading = true
		await fetch(`/api/shortener/${deleteShortenerCode}`, {
			method: 'delete',
		})
		isDeleteLoading = false
		toast.success('Shortener deleted successfully')
		deleteDialogOpen = false
		await invalidateAll()
	}

	let qrDialogOpen = false
	let qrCode = ''

	const openQRDialog = (code: string) => {
		qrCode = code
		qrDialogOpen = true
	}
</script>

<svelte:head>
	<title>Shorteners</title>
</svelte:head>

<div class="flex items-center justify-start gap-4 p-4">
	<Popover.Root bind:open>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class="w-[200px] justify-between">
				{selectedProject}
				<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[200px] p-0">
			<Command.Root>
				<Command.Input placeholder="Search project..." />
				<Command.Empty>No project found.</Command.Empty>
				<Command.Group>
					<a href={`/links`}>
						<Command.Item onSelect={() => (open = false)}>
							<Check
								class={cn(
									'mr-2 h-4 w-4',
									data.selected_project.value !== null &&
										'text-transparent',
								)} />
							All
						</Command.Item>
					</a>
					{#each data.projects as project}
						<a href={`/links?project=${project.uuid}`}>
							<Command.Item onSelect={() => (open = false)}>
								<Check
									class={cn(
										'mr-2 h-4 w-4',
										data.selected_project.value !== project.uuid &&
											'text-transparent',
									)} />
								{project.name}
							</Command.Item>
						</a>
					{/each}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
	<AddShortenerDialog {dialogOpen} projects={data.projects} />
</div>

{#await data.shorteners}
	<div class="flex flex-wrap gap-4 p-4">
		<Skeleton class="h-[150px] w-[500px] rounded-lg" />
		<Skeleton class="h-[150px] w-[500px] rounded-lg" />
		<Skeleton class="h-[150px] w-[500px] rounded-lg" />
		<Skeleton class="h-[150px] w-[500px] rounded-lg" />
		<Skeleton class="h-[150px] w-[500px] rounded-lg" />
		<Skeleton class="h-[150px] w-[500px] rounded-lg" />
		<Skeleton class="h-[150px] w-[500px] rounded-lg" />
		<Skeleton class="h-[150px] w-[500px] rounded-lg" />
	</div>
{:then shorteners}
	{#if shorteners.length > 0}
		<ScrollArea>
			<div class="flex flex-wrap gap-4 p-4">
				{#each shorteners as shortener}
					<Card.Root class="w-full max-w-[500px]">
						<Card.Header>
							<Card.Title
								class="flex items-center justify-between gap-2">
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
								<div class="flex gap-4">
									<Badge variant="outline" class="flex gap-2">
										{#if shortener.active}
											<span
												class="relative inline-flex h-2 w-2 rounded-full bg-green-400"
											></span>
											Active
										{:else}
											<span
												class="relative inline-flex h-2 w-2 rounded-full bg-gray-600"
											></span>
											Inactive
										{/if}
									</Badge>
									<Badge variant="secondary"
										>{shortener.project
											? shortener.project.name
											: 'Uncategorized'}</Badge>
								</div>
							</Card.Title>
							<Card.Description>{shortener.link}</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="flex items-center justify-between">
								<div class="flex gap-2">
									<Button
										href={`/links/${shortener.code}`}
										class="flex h-8 items-center justify-center gap-1 rounded bg-secondary text-sm">
										<BarChart size={20} />
										<div>
											{shortener.visitor.length} visits
										</div>
									</Button>
									<Button
										class="flex h-8 items-center justify-center gap-1 rounded bg-secondary text-sm"
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
													openEditDialog(
														shortener.code,
														shortener.link,
														shortener.projectId,
														shortener.project?.name,
														shortener.active,
													)}>
												Edit
											</DropdownMenu.Item>
											<DropdownMenu.Item
												on:click={() =>
													openDeleteDialog(shortener.code)}
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
		</ScrollArea>
	{:else}
		<div class="flex h-full w-full items-center justify-center">
			<div class="flex flex-col items-center gap-12">
				<div class="flex flex-col items-center gap-4">
					<div class="text-4xl font-bold">No Shortener Found</div>
				</div>
				<Button
					on:click={() => {
						dialogOpen = true
					}}
					class="w-fit">Add Shortener</Button>
			</div>
		</div>
	{/if}
{/await}

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
				code={qrCode}
				value={data.shortener_url + '/' + qrCode}
				background={data.settings?.qr_background || '#fff'}
				color={data.settings?.qr_foreground || '#000'} />
		</div>
	</Dialog.Content>
</Dialog.Root>

<AlertDialog.Root bind:open={deleteDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				You are about to delete a shortener.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={isDeleteLoading}
				>Cancel</AlertDialog.Cancel>
			<Button
				variant="destructive"
				on:click={deleteShortener}
				class="flex gap-2"
				disabled={isDeleteLoading}>
				{#if isDeleteLoading}
					<Loader2 class="animate-spin" />
				{/if}
				Delete
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
