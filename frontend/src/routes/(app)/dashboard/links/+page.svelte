<script lang="ts">
	import { page } from '$app/stores'

	import { Button } from '$lib/components/ui/button'
	import * as Select from '$lib/components/ui/select/index.js'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Input } from '$lib/components/ui/input'
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import * as Drawer from '$lib/components/ui/drawer'
	import * as Pagination from '$lib/components/ui/pagination'

	import {
		ChevronLeft,
		ChevronRight,
		SortAscIcon,
	} from 'lucide-svelte'

	import ShortenerCard from '$lib/components/ShortenerCard.svelte'
	import Form from './(components)/form.svelte'
	import ProjectLinkQRPage from '../projects/[id]/links/[linkid]/qr/+page.svelte'
	import LinkQRPage from './[id]/qr/+page.svelte'
	import type { Project, Shortener } from '$lib/db/types'

	let { data } = $props()

	let dialogOpen = $state(false)

	let search = $state<string | null>('')
	let searchUpdateTimeout = $state<any>()

	let pageNumber = $state(1)
	let perPage = $state(12)
	let sortBy = $state('latest')
	let selectedProject = $state('all')

	const fetchShorteners = async (
		page: number,
		perPage: number,
		sortBy: string,
		project: string,
		search: string | null,
	) => {
		const searchParams = new URLSearchParams()

		if (page) searchParams.set('page', page.toString())
		if (perPage) searchParams.set('perPage', perPage.toString())
		if (sortBy) searchParams.set('sortBy', sortBy)
		if (project) searchParams.set('project', project)
		if (search) searchParams.set('search', search)

		const response = await fetch(
			`/api/shortener?${searchParams.toString()}`,
		)

		const data = await response.json()

		return {
			shorteners: data.shorteners as (Shortener & {
				visitorCount: number
				project: Project
			})[],
			pagination: data.pagination as { total: number },
		}
	}
</script>

<div
	class="flex flex-wrap-reverse items-center justify-start gap-4 p-4">
	<!-- <Drawer.Root>
		<Drawer.Trigger class="md:hidden">
			<Button size="icon"><SortAscIcon /></Button>
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>Filter</Drawer.Title>
				<Drawer.Description>Sort & Search</Drawer.Description>
			</Drawer.Header>
			<Drawer.Footer class="gap-6">
				<Select.Root
					selected={sortBy}
					onSelectedChange={(selected) => {
						if (!selected) return
						sortBy = selected
						pageNumber = 1
					}}>
					<Select.Trigger>
						<Select.Value placeholder="Sort By" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Sort By</Select.Label>
							{#each [{ label: 'Latest', value: 'latest' }, { label: 'Oldest', value: 'oldest' }, { label: 'Most Visited', value: 'most_visited' }] as sortBy}
								<Select.Item
									value={sortBy.value}
									label={sortBy.label}>
									{sortBy.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
					<Select.Input name="favoriteFruit" />
				</Select.Root>
				{#await data.projects}
					<Skeleton class="h-[40px] w-[180px]" />
				{:then projects}
					<Select.Root
						selected={selectedProject}
						onSelectedChange={(selected) => {
							if (!selected) return
							selectedProject = selected
							pageNumber = 1
						}}>
						<Select.Trigger>
							<Select.Value placeholder="Sort By" />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Project</Select.Label>
								<Select.Separator />
								<Select.Item value={'all'} label={'All'}>
									All
								</Select.Item>
								<Select.Separator />
								{#each projects as project}
									<Select.Item
										value={project.id}
										label={project.name}>
										{project.name}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
						<Select.Input name="favoriteFruit" />
					</Select.Root>
				{/await}

				<div class="flex items-center gap-4">
					<Input
						type="text"
						placeholder="search"
						autofocus
						value={search}
						oninput={({ target }) => {
							clearTimeout(searchUpdateTimeout)
							searchUpdateTimeout = setTimeout(() => {
								search = target.value
								pageNumber = 1
							}, 500)
						}} />
					<Button disabled={!search} onclick={() => (search = '')}>
						Clear
					</Button>
				</div>
				<div></div>
				<Drawer.Close>
					<Button class="w-full">Close</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root> -->
	<div class="hidden items-center gap-4 md:flex">
		{#await data.projects}
			<Skeleton class="h-[40px] w-[180px]" />
		{:then projects}
			<Select.Root
				name="selected_project"
				type="single"
				bind:value={selectedProject}>
				<Select.Trigger class="w-[180px]">
					{projects.find((project) => project.id == selectedProject)
						?.name || 'All'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.GroupHeading>Project</Select.GroupHeading>
						<Select.Separator />
						<Select.Item value={'all'} label={'All'}>All</Select.Item>
						<Select.Separator />
						{#each projects as project}
							<Select.Item value={project.id} label={project.name}>
								{project.name}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{/await}
		<Select.Root name="sort_by" type="single" bind:value={sortBy}>
			<Select.Trigger class="w-[180px]">
				{sortBy}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.GroupHeading>Sort By</Select.GroupHeading>
					{#each [{ label: 'Latest', value: 'latest' }, { label: 'Oldest', value: 'oldest' }, { label: 'Most Visited', value: 'most_visited' }] as sortBy}
						<Select.Item value={sortBy.value}>
							{sortBy.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
	<div class="hidden items-center gap-4 sm:flex">
		<Input
			type="text"
			placeholder="search"
			class="max-w-[250px]"
			autofocus
			value={search}
			oninput={({ target }) => {
				clearTimeout(searchUpdateTimeout)
				searchUpdateTimeout = setTimeout(() => {
					search = target.value
					pageNumber = 1
				}, 500)
			}} />
		<Button disabled={!search} onclick={() => (search = '')}>
			Clear
		</Button>
	</div>
	{#await data.projects then projects}
		<Form bind:dialogOpen data={data.form} {projects} />
	{/await}
</div>

{#await fetchShorteners(pageNumber, perPage, sortBy, selectedProject, search)}
	<div class="flex-grow">
		<div class="flex flex-wrap gap-4 p-4">
			{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as _}
				<Skeleton class="h-[150px] w-[500px] rounded-lg" />
			{/each}
		</div>
	</div>
{:then result}
	{#if result.shorteners.length > 0}
		<ScrollArea class="flex-grow">
			<div
				class="grid grid-cols-1 gap-4 p-4 md:grid-cols-[repeat(auto-fit,_minmax(500px,_1fr))]">
				{#each result.shorteners as shortener}
					<ShortenerCard
						{shortener}
						project={shortener.project}
						shortener_url={data.shortener_url} />
				{/each}
			</div>
		</ScrollArea>
		<div class="flex items-center justify-between border-t p-4">
			<Select.Root
				name="page_size"
				type="single"
				value={perPage.toString()}
				onValueChange={(value) => {
					perPage = parseInt(value)
					pageNumber = 1
				}}>
				<Select.Trigger class="w-[180px]">
					{perPage}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.GroupHeading>Page Size</Select.GroupHeading>
						{#each [12, 24, 48, 96] as pageSize}
							<Select.Item value={pageSize.toString()}>
								{pageSize}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<Pagination.Root
				class="items-end"
				count={result.pagination.total}
				{perPage}
				bind:page={pageNumber}>
				{#snippet children({ pages, currentPage })}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.PrevButton>
								<ChevronLeft class="h-4 w-4" />
								<span class="hidden sm:block">Previous</span>
							</Pagination.PrevButton>
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link
										{page}
										isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.NextButton>
								<span class="hidden sm:block">Next</span>
								<ChevronRight class="h-4 w-4" />
							</Pagination.NextButton>
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		</div>
	{:else}
		<div class="flex flex-grow p-4">
			<div
				class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
				<div
					class="flex w-full flex-grow items-center justify-center">
					<div class="flex flex-col items-center gap-8">
						<div class="flex flex-col items-center gap-2">
							<div class="text-4xl font-bold">No Shortener Found</div>
							<p class="text-muted-foreground">Add a new shortener</p>
						</div>
						<Button
							onclick={() => {
								dialogOpen = true
							}}
							class="w-fit">
							Add Shortener
						</Button>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/await}

{#if $page.state.linkQR}
	<Dialog.Root
		open
		onOpenChange={(open) => {
			if (!open) {
				history.back()
			}
		}}>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Shortener QR</Dialog.Title>
				<Dialog.Description>
					Use this QR code to share the shortener.
				</Dialog.Description>
			</Dialog.Header>
			<ScrollArea class="max-h-[calc(100vh-200px)]">
				<LinkQRPage data={$page.state.linkQR} shallowRouting />
			</ScrollArea>
		</Dialog.Content>
	</Dialog.Root>
{/if}

{#if $page.state.projectLinkQR}
	<Dialog.Root
		open
		onOpenChange={(open) => {
			if (!open) {
				history.back()
			}
		}}>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Shortener QR</Dialog.Title>
				<Dialog.Description>
					Use this QR code to share the shortener.
				</Dialog.Description>
			</Dialog.Header>
			<ScrollArea class="max-h-[calc(100vh-200px)]">
				<ProjectLinkQRPage
					data={$page.state.projectLinkQR}
					shallowRouting />
			</ScrollArea>
		</Dialog.Content>
	</Dialog.Root>
{/if}
