<script lang="ts">
	import { goto } from '$app/navigation'
	import { browser } from '$app/environment'
	import { page } from '$app/stores'

	import ShortenerCard from '$lib/components/ShortenerCard.svelte'
	import CustomPaginationBar from '$lib/components/Custom-Pagination-Bar.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import { Input } from '$lib/components/ui/input'
	import * as Select from '$lib/components/ui/select'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Drawer from '$lib/components/ui/drawer'

	import {
		ChevronLeft,
		ChevronRight,
		SortAscIcon,
		SortDescIcon,
	} from 'lucide-svelte'

	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import Form from './(components)/form.svelte'
	import EditProjectLinkPage from './links/[linkid]/edit/+page.svelte'
	import ProjectLinkQRPage from './links/[linkid]/qr/+page.svelte'
	import type { Project, Shortener } from '$lib/db/types'
	import * as Pagination from '$lib/components/ui/pagination'

	let { data } = $props()

	let dialogOpen = $state(false)

	let search = $state<string | null>(data.search)
	let searchUpdateTimeout = $state<any>()

	let pageNumber = $state(1)
	let perPage = $state(12)
	let sortBy = $state('latest')
	const selectedProject = data.selectedProject.id

	let editProjectLinkOpen = $state(false)
	let projectLinkQROpen = $state(false)

	$effect(() => {
		editProjectLinkOpen = !!$page.state.editProjectLink
		projectLinkQROpen = !!$page.state.projectLinkQR
	})

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
	class="flex flex-wrap-reverse items-center justify-start gap-4 px-4 py-4 md:px-10">
	<div class="hidden items-center gap-4 md:flex">
		<Select.Root bind:value={sortBy} type="single" name="sortBy">
			<Select.Trigger class="w-[180px]">
				{sortBy}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.GroupHeading>Sort By</Select.GroupHeading>
					{#each ['latest', 'oldest', 'most_visited'] as sortBy}
						<Select.Item value={sortBy} label={sortBy}>
							{sortBy.removeUnderscores().capitalize()}
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
				}, 500)
			}} />
		<Button disabled={!search} onclick={() => (search = '')}>
			Clear
		</Button>
	</div>
	<Form bind:dialogOpen data={data.form} />
</div>

{#await fetchShorteners(pageNumber, perPage, sortBy, selectedProject, search)}
	<div class="flex flex-wrap gap-4 px-4 py-4 md:px-10">
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as _}
			<Skeleton class="h-[150px] w-[500px] rounded-lg" />
		{/each}
	</div>
{:then result}
	{#if result.shorteners.length > 0}
		<ScrollArea class="flex-grow">
			<div
				class="grid grid-cols-[repeat(auto-fit,_minmax(500px,_1fr))] gap-4 px-4 py-4 md:px-10">
				{#each result.shorteners as shortener}
					<ShortenerCard
						{shortener}
						project={data.project}
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
		<div class="flex flex-grow px-4 py-4 md:px-10">
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

<Dialog.Root
	bind:open={editProjectLinkOpen}
	onOpenChange={(open) => {
		if (!open) {
			history.back()
		}
	}}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit Shortener</Dialog.Title>
			<Dialog.Description>
				Edit Shortener Here. Click Save To Save.
			</Dialog.Description>
		</Dialog.Header>
		<ScrollArea class="max-h-[calc(100vh-200px)]">
			<EditProjectLinkPage
				data={$page.state.editProjectLink}
				shallowRouting />
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root
	bind:open={projectLinkQROpen}
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
