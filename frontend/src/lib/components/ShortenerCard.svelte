<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import * as Card from '$lib/components/ui/card'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as Avatar from '$lib/components/ui/avatar'
	import { Badge } from '$lib/components/ui/badge'
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import { Separator } from '$lib/components/ui/separator'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import type { Project, Shortener } from '$lib/db/types'
	import {
		BarChart,
		EditIcon,
		ExternalLink,
		MoreVertical,
		QrCode,
		TrashIcon,
		Loader2Icon,
	} from 'lucide-svelte'
	import DeleteShortenerDialog from './DeleteShortenerDialog.svelte'
	import EditLinkPage from '$lib/../routes/(app)/dashboard/links/[id]/edit/+page.svelte'
	import ProjectEditLinkPage from '$lib/../routes/(app)/dashboard/projects/[id]/links/[linkid]/edit/+page.svelte'

	import { goto, preloadData, pushState } from '$app/navigation'
	import { cn } from '$lib/utils'
	import type { page } from '$app/stores'

	let {
		shortener,
		project,
		shortener_url,
	}: {
		shortener: Shortener & { visitorCount: number }
		project: Project | null
		shortener_url: string
	} = $props()

	let deleteDialogOpen = $state(false)
	let deleteShortenerCode = $state('')

	const openDeleteDialog = (code: string) => {
		deleteShortenerCode = code
		deleteDialogOpen = true
	}

	const getUrl = () => {
		if (project) {
			return `/dashboard/projects/${project.uuid}`
		}
		return '/dashboard'
	}

	let editProjectLinkOpen = $state(false)
	let isLoadingEditProjectData = $state(false)
	let editData:
		| typeof $page.state.editLink
		| typeof $page.state.editProjectLink
		| undefined = $state()

	const showEditModal = async (code: string) => {
		isLoadingEditProjectData = true
		editProjectLinkOpen = true
		const href = project
			? `/dashboard/projects/${project.uuid}/links/${shortener.id}/edit`
			: `/dashboard/links/${code}/edit`
		const result = await preloadData(href)

		if (result.type === 'loaded' && result.status === 200) {
			editData = project
				? (result.data as typeof $page.state.editProjectLink)
				: (result.data as typeof $page.state.editLink)
			setTimeout(() => {
				isLoadingEditProjectData = false
			}, 5000)
		} else {
			// something bad happened! try navigating
			goto(href)
		}
	}

	let isLoadingQrModal = $state(false)
	const showQRModal = async (e: MouseEvent) => {
		isLoadingQrModal = true
		const { href } = e.currentTarget as HTMLAnchorElement

		if (innerWidth < 640) goto(href)

		const result = await preloadData(href)

		if (result.type === 'loaded' && result.status === 200) {
			if (getUrl().startsWith('/dashboard/projects')) {
				pushState(href, { projectLinkQR: result.data })
			} else {
				pushState(href, { linkQR: result.data })
			}
		} else {
			goto(href)
		}
		isLoadingQrModal = false
	}

	const shortenerUrl = project?.enable_custom_domain
		? project.custom_domain || shortener_url
		: shortener_url
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="flex items-center justify-between gap-4">
			<Avatar.Root class="overflow-visible">
				<Avatar.Image
					src={'https://www.google.com/s2/favicons?sz=128&domain_url=' +
						shortener.link}
					alt="favicon"
					class="h-10 w-10" />
				<Avatar.Fallback class="h-10 w-10 bg-opacity-0">
					<img src="/favicon.png" alt="favicon" />
				</Avatar.Fallback>
			</Avatar.Root>

			<div class="flex flex-grow flex-col items-start gap-2">
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<div
								class="max-w-[250px] overflow-x-clip overflow-ellipsis whitespace-nowrap">
								{shortener.link}
							</div>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>{shortener.link}</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>

				<div
					class="text-muted-foreground flex items-center gap-2 text-sm">
					<a
						href={'https://' + shortenerUrl + '/' + shortener.code}
						target="_blank"
						class="hover:underline">
						{shortenerUrl + '/' + shortener.code}
					</a>
					<ExternalLink size={16} />
				</div>
			</div>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<MoreVertical />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<a
							href={`/dashboard/links/${shortener.code}/edit`}
							onclick={(event) => {
								event.preventDefault()
								showEditModal(shortener.code)
							}}>
							<DropdownMenu.Item class="flex items-center gap-2">
								<EditIcon size={16} />Edit
							</DropdownMenu.Item>
						</a>
						<DropdownMenu.Item
							onclick={() => openDeleteDialog(shortener.id)}
							class="text-destructive data-[highlighted]:bg-destructive flex items-center gap-2">
							<TrashIcon size={16} />
							Delete
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex items-center justify-between">
			<div class="flex gap-2">
				<Button
					href={`/dashboard/links/${shortener.id}`}
					class="bg-secondary flex h-8 items-center justify-center gap-1 rounded text-sm">
					<BarChart size={20} />
					<div>
						{shortener.visitorCount} visits
					</div>
				</Button>
				<a
					class={cn(
						buttonVariants({ variant: 'default' }),
						'bg-secondary flex h-8 items-center justify-center gap-1 rounded text-sm',
					)}
					href={`${getUrl()}/links/${shortener.code}/qr`}
					onclick={(event) => {
						event.preventDefault()
						showQRModal(event)
					}}>
					{#if isLoadingQrModal}
						<Loader2Icon size={20} class="animate-spin" />
					{:else}
						<QrCode size={20} />
					{/if}
				</a>
				{#if (shortener.ios && shortener.ios_link) || (shortener.android && shortener.android_link)}
					<Separator orientation="vertical" class="hidden sm:block" />
				{/if}
				{#if shortener.ios && shortener.ios_link}
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger class="hidden gap-2 sm:inline-flex">
								<Badge variant="outline" class="flex gap-2">
									iOS
								</Badge>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>{shortener.ios_link}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				{/if}
				{#if shortener.android && shortener.android_link}
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger class="hidden gap-2 sm:inline-flex">
								<Badge variant="outline" class="flex gap-2">
									Android
								</Badge>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>{shortener.android_link}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				{/if}
			</div>
			<div class="flex gap-4">
				{#if project}
					<Badge variant="secondary" class="hidden sm:flex">
						{project.name}
					</Badge>
				{/if}
				<Badge variant="outline" class="flex gap-2">
					{#if shortener.active}
						<span
							class="relative inline-flex h-2 w-2 rounded-full bg-green-400">
						</span>
						Active
					{:else}
						<span
							class="relative inline-flex h-2 w-2 rounded-full bg-gray-600">
						</span>
						Inactive
					{/if}
				</Badge>
			</div>
		</div>
	</Card.Content>
</Card.Root>

<DeleteShortenerDialog bind:deleteDialogOpen {deleteShortenerCode} />

<Dialog.Root bind:open={editProjectLinkOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit Shortener</Dialog.Title>
			<Dialog.Description>
				Edit Shortener Here. Click Save To Save.
			</Dialog.Description>
		</Dialog.Header>
		<ScrollArea class="max-h-[calc(100vh-200px)]">
			{#if isLoadingEditProjectData}
				<Skeleton class="h-screen" />
			{:else if project}
				<ProjectEditLinkPage data={editData} shallowRouting />
			{:else}
				<EditLinkPage data={editData} shallowRouting />
			{/if}
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>
