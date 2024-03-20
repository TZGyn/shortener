<script lang="ts">
	import type { PageData } from './$types'
	import { cn } from '$lib/utils'
	import { goto } from '$app/navigation'
	import { browser } from '$app/environment'

	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Card from '$lib/components/ui/card'
	import * as Select from '$lib/components/ui/select'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as Command from '$lib/components/ui/command'
	import * as Popover from '$lib/components/ui/popover'
	import { Badge } from '$lib/components/ui/badge'
	import * as Pagination from '$lib/components/ui/pagination'
	import { Input } from '$lib/components/ui/input'
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'

	import {
		BarChart,
		ExternalLink,
		MoreVertical,
		QrCode,
		Check,
		ChevronsUpDown,
		SortDescIcon,
	} from 'lucide-svelte'

	import Qr from '$lib/components/QR.svelte'
	import AddShortenerDialog from './(component)/AddShortenerDialog.svelte'
	import EditShortenerDialog from './(component)/EditShortenerDialog.svelte'
	import DeleteShortenerDialog from './(component)/DeleteShortenerDialog.svelte'

	export let data: PageData

	let dialogOpen = false

	let editDialogOpen = false
	let editShortenerCode = ''
	let editShortenerLink = ''
	let editShortenerCategory: any = undefined
	let editShortenerActive = false

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
		editShortenerCode = code
		editShortenerLink = link
		editShortenerActive = active
		if (projectId) {
			editShortenerCategory = { value: projectId, label: projectName }
		} else {
			editShortenerCategory = undefined
		}
		editDialogOpen = true
	}

	let deleteDialogOpen = false
	let deleteShortenerCode = ''
	const openDeleteDialog = (code: string) => {
		deleteShortenerCode = code
		deleteDialogOpen = true
	}

	let qrDialogOpen = false
	let qrCode = ''

	const openQRDialog = (code: string) => {
		qrCode = code
		qrDialogOpen = true
	}

	let page: number = data.page
	let perPage: any = { label: data.perPage, value: data.perPage }
	let selectedProjectUUID: string | null
	$: selectedProjectUUID = data.selected_project.value
	let search: string | null = data.search
	let searchUpdateTimeout: any
	let sortBy: any = { label: data.sortBy, value: data.sortBy }

	$: browser &&
		updateUrl(selectedProjectUUID, page, perPage, search, sortBy)

	const updateUrl = (
		selectedProjectUUID: string | null,
		page: number,
		perPage: any,
		search: string | null,
		sortBy: any,
	) => {
		let query = [`page=${page}`, `perPage=${perPage.value}`]
		if (selectedProjectUUID) {
			query.push(`project=${selectedProjectUUID}`)
		}
		if (search) {
			query.push(`search=${encodeURI(search)}`)
		}
		if (sortBy) {
			query.push(`sortBy=${sortBy.value}`)
		}

		goto(`/links?${query.join('&')}`)
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
					<Command.Item
						onSelect={() => {
							selectedProjectUUID = null
							page = 1
							open = false
						}}>
						<Check
							class={cn(
								'mr-2 h-4 w-4',
								data.selected_project.value !== null &&
									'text-transparent',
							)} />
						All
					</Command.Item>
					{#each data.projects as project}
						<Command.Item
							onSelect={() => {
								selectedProjectUUID = project.uuid
								page = 1
								open = false
							}}>
							<Check
								class={cn(
									'mr-2 h-4 w-4',
									data.selected_project.value !== project.uuid &&
										'text-transparent',
								)} />
							{project.name}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
	<Select.Root bind:selected={sortBy}>
		<Select.Trigger class="w-[180px]" customIcon={SortDescIcon}>
			<Select.Value placeholder="Sort By" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Sort By</Select.Label>
				{#each ['latest', 'oldest', 'most_visited'] as sortBy}
					<Select.Item value={sortBy} label={sortBy}
						>{sortBy}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="favoriteFruit" />
	</Select.Root>
	<Input
		type="text"
		placeholder="search"
		class="max-w-[250px]"
		autofocus
		value={search}
		on:input={({ target }) => {
			clearTimeout(searchUpdateTimeout)
			searchUpdateTimeout = setTimeout(() => {
				search = target.value
			}, 500)
		}} />
	<Button disabled={!search} on:click={() => (search = '')}
		>Clear</Button>
	<AddShortenerDialog bind:dialogOpen projects={data.projects} />
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
		<ScrollArea class="flex-grow">
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
									{#if shortener.projectName}
										<Badge variant="secondary"
											>{shortener.projectName}</Badge>
									{/if}
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
											{shortener.visitorCount} visits
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
		<div class="flex items-center justify-between border-t p-4">
			<Select.Root bind:selected={perPage}>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Page Size" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Page Size</Select.Label>
						{#each [10, 20, 50, 100] as pageSize}
							<Select.Item
								value={pageSize}
								label={pageSize.toString()}>{pageSize}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input name="favoriteFruit" />
			</Select.Root>
			<Pagination.Root
				class="items-end "
				count={shorteners[0].fullcount}
				bind:page
				perPage={perPage.value}
				let:pages
				let:currentPage>
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton />
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item isVisible={currentPage == page.value}>
								<Pagination.Link
									{page}
									isActive={currentPage == page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.NextButton />
					</Pagination.Item>
				</Pagination.Content>
			</Pagination.Root>
		</div>
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

<EditShortenerDialog
	projects={data.projects}
	bind:editDialogOpen
	{editShortenerCode}
	{editShortenerLink}
	{editShortenerActive}
	{editShortenerCategory} />

<DeleteShortenerDialog bind:deleteDialogOpen {deleteShortenerCode} />

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
				bind:code={qrCode}
				value={data.shortener_url + '/' + qrCode}
				background={data.settings?.qr_background || '#fff'}
				color={data.settings?.qr_foreground || '#000'} />
		</div>
	</Dialog.Content>
</Dialog.Root>
