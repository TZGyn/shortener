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

	let search: string | null = data.search
	let searchUpdateTimeout: any

	$: browser &&
		goto(updateSearchParam([{ name: 'search', value: search }]))

	const updateSearchParam = (
		params: { name: string; value: any }[],
	) => {
		const urlParams = new URLSearchParams(window.location.search)
		params.map(({ name, value }) => {
			if (value) {
				urlParams.set(name, value)
			} else {
				urlParams.delete(name)
			}
		})
		const searchParams = urlParams.toString()
		if (searchParams) {
			return '/links?' + searchParams
		} else {
			return '/links'
		}
	}
</script>

<div class="flex gap-4 justify-start items-center p-4">
	<Popover.Root bind:open>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class="justify-between w-[200px]">
				{selectedProject}
				<ChevronsUpDown class="ml-2 w-4 h-4 opacity-50 shrink-0" />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="p-0 w-[200px]">
			<Command.Root>
				<Command.Input placeholder="Search project..." />
				<Command.Empty>No project found.</Command.Empty>
				<Command.Group>
					<a
						href={updateSearchParam([
							{
								name: 'project',
								value: undefined,
							},
							{
								name: 'page',
								value: 1,
							},
						])}>
						<Command.Item
							onSelect={() => {
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
					</a>
					{#each data.projects as project}
						<a
							href={updateSearchParam([
								{
									name: 'project',
									value: project.uuid,
								},
								{
									name: 'page',
									value: 1,
								},
							])}>
							<Command.Item
								onSelect={() => {
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
						</a>
					{/each}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
	<Select.Root selected={{ label: data.sortBy, value: data.sortBy }}>
		<Select.Trigger class="w-[180px]" customIcon={SortDescIcon}>
			<Select.Value placeholder="Sort By" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Sort By</Select.Label>
				{#each ['latest', 'oldest', 'most_visited'] as sortBy}
					<a
						href={updateSearchParam([
							{ name: 'sortBy', value: sortBy },
							{ name: 'page', value: 1 },
						])}>
						<Select.Item value={sortBy} label={sortBy}>
							{sortBy}
						</Select.Item>
					</a>
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
		<Skeleton class="rounded-lg h-[150px] w-[500px]" />
		<Skeleton class="rounded-lg h-[150px] w-[500px]" />
		<Skeleton class="rounded-lg h-[150px] w-[500px]" />
		<Skeleton class="rounded-lg h-[150px] w-[500px]" />
		<Skeleton class="rounded-lg h-[150px] w-[500px]" />
		<Skeleton class="rounded-lg h-[150px] w-[500px]" />
		<Skeleton class="rounded-lg h-[150px] w-[500px]" />
		<Skeleton class="rounded-lg h-[150px] w-[500px]" />
	</div>
{:then shorteners}
	{#if shorteners.length > 0}
		<ScrollArea class="flex-grow">
			<div class="flex flex-wrap gap-4 p-4">
				{#each shorteners as shortener}
					<Card.Root class="w-full max-w-[500px]">
						<Card.Header>
							<Card.Title
								class="flex gap-2 justify-between items-center">
								<div class="flex gap-2 items-center">
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
												class="inline-flex relative w-2 h-2 bg-green-400 rounded-full"
											></span>
											Active
										{:else}
											<span
												class="inline-flex relative w-2 h-2 bg-gray-600 rounded-full"
											></span>
											Inactive
										{/if}
									</Badge>
								</div>
							</Card.Title>
							<Card.Description>{shortener.link}</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="flex justify-between items-center">
								<div class="flex gap-2">
									<Button
										href={`/links/${shortener.code}`}
										class="flex gap-1 justify-center items-center h-8 text-sm rounded bg-secondary">
										<BarChart size={20} />
										<div>
											{shortener.visitorCount} visits
										</div>
									</Button>
									<Button
										class="flex gap-1 justify-center items-center h-8 text-sm rounded bg-secondary"
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
		<div class="flex flex-grow justify-center items-center w-full">
			<div class="flex flex-col gap-12 items-center">
				<div class="flex flex-col gap-4 items-center">
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

{#await data.pagination then pagination}
	<div class="flex justify-between items-center p-4 border-t">
		<Select.Root
			selected={{ label: data.perPage, value: data.perPage }}>
			<Select.Trigger class="w-[180px]">
				<Select.Value placeholder="Page Size" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Page Size</Select.Label>
					{#each [12, 24, 48, 96] as pageSize}
						<a
							href={updateSearchParam([
								{
									name: 'perPage',
									value: pageSize,
								},
								{
									name: 'page',
									value: 1,
								},
							])}>
							<Select.Item
								value={pageSize}
								label={pageSize.toString()}>{pageSize}</Select.Item>
						</a>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="favoriteFruit" />
		</Select.Root>
		<Pagination.Root
			class="items-end"
			count={pagination[0].total}
			page={data.page}
			perPage={data.perPage}
			let:pages
			let:currentPage>
			<Pagination.Content>
				{#if data.page <= 1}
					<Pagination.Item>
						<Pagination.PrevButton />
					</Pagination.Item>
				{:else}
					<a
						href={updateSearchParam([
							{
								name: 'page',
								value: data.page - 1,
							},
						])}>
						<Pagination.Item>
							<Pagination.PrevButton />
						</Pagination.Item>
					</a>
				{/if}
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<a
							href={updateSearchParam([
								{
									name: 'page',
									value: page.value,
								},
							])}>
							<Pagination.Item isVisible={currentPage == page.value}>
								<Pagination.Link
									{page}
									isActive={currentPage == page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						</a>
					{/if}
				{/each}
				{#if data.page >= pagination[0].total / data.perPage}
					<Pagination.Item>
						<Pagination.NextButton />
					</Pagination.Item>
				{:else}
					<a
						href={updateSearchParam([
							{
								name: 'page',
								value: data.page + 1,
							},
						])}>
						<Pagination.Item>
							<Pagination.NextButton />
						</Pagination.Item>
					</a>
				{/if}
			</Pagination.Content>
		</Pagination.Root>
	</div>
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
		<div class="flex flex-col gap-4 items-center h-full">
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
