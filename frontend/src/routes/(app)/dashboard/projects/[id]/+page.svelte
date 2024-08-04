<script lang="ts">
	import { goto } from '$app/navigation'
	import { browser } from '$app/environment'
	import { page } from '$app/stores'

	import ShortenerCard from './(components)/ShortenerCard.svelte'
	import CustomPaginationBar from '$lib/components/Custom-Pagination-Bar.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import { Input } from '$lib/components/ui/input'
	import * as Select from '$lib/components/ui/select'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Drawer from '$lib/components/ui/drawer'

	import { SortAscIcon, SortDescIcon } from 'lucide-svelte'

	import type { PageData } from './$types'
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import Form from './(components)/form.svelte'
	import EditProjectLinkPage from './links/[linkid]/edit/+page.svelte'
	import ProjectLinkQRPage from './links/[linkid]/qr/+page.svelte'

	export let data: PageData

	let dialogOpen = false

	let search: string | null = data.search
	let searchUpdateTimeout: any

	$: browser &&
		goto(
			updateSearchParam([
				{ name: 'search', value: search },
				{
					name: 'page',
					value: 1,
				},
			]),
		)

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
			return (
				`/dashboard/projects/${data.selectedProject.uuid}?` +
				searchParams
			)
		} else {
			return '/dashboard/projects/' + data.selectedProject.uuid
		}
	}

	let editProjectLinkOpen = false

	$: editProjectLinkOpen = !!$page.state.editProjectLink
	$: projectLinkQROpen = !!$page.state.projectLinkQR
</script>

<div
	class="flex flex-wrap-reverse items-center justify-start gap-4 px-4 py-4 md:px-10">
	<Drawer.Root>
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
					selected={{ label: data.sortBy, value: data.sortBy }}>
					<Select.Trigger>
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
										{sortBy.removeUnderscores().capitalize()}
									</Select.Item>
								</a>
							{/each}
						</Select.Group>
					</Select.Content>
					<Select.Input name="favoriteFruit" />
				</Select.Root>

				<div class="flex gap-2">
					<Input
						type="text"
						placeholder="search"
						value={search}
						on:input={({ target }) => {
							clearTimeout(searchUpdateTimeout)
							searchUpdateTimeout = setTimeout(() => {
								search = target.value
							}, 500)
						}} />
					<Button disabled={!search} on:click={() => (search = '')}>
						Clear
					</Button>
				</div>
				<div></div>
				<Drawer.Close>
					<Button class="w-full">Close</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
	<div class="hidden items-center gap-4 md:flex">
		<Select.Root
			selected={{ label: data.sortBy, value: data.sortBy }}>
			<Select.Trigger class="w-[180px]">
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
								{sortBy.removeUnderscores().capitalize()}
							</Select.Item>
						</a>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="favoriteFruit" />
		</Select.Root>
	</div>
	<div class="hidden items-center gap-4 sm:flex">
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
		<Button disabled={!search} on:click={() => (search = '')}>
			Clear
		</Button>
	</div>
	<Form bind:dialogOpen data={data.form} />
</div>

{#await data.shorteners}
	<div class="flex flex-wrap gap-4 px-4 py-4 md:px-10">
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as _}
			<Skeleton class="h-[150px] w-[500px] rounded-lg" />
		{/each}
	</div>
{:then shorteners}
	{#if shorteners.length > 0}
		<ScrollArea class="flex-grow">
			<div
				class="grid grid-cols-[repeat(auto-fit,_minmax(500px,_1fr))] gap-4 px-4 py-4 md:px-10">
				{#each shorteners as shortener}
					<ShortenerCard
						{shortener}
						selected_project={data.selectedProject}
						shortener_url={data.shortener_url}
						settings={data.settings} />
				{/each}
			</div>
		</ScrollArea>
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
							on:click={() => {
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

{#await data.pagination then pagination}
	<CustomPaginationBar
		perPage={data.perPage}
		page={data.page}
		total={pagination[0].total}
		path={'/dashboard/projects/' + data.selectedProject.uuid} />
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
