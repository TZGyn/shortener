<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import * as Card from '$lib/components/ui/card'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import * as Avatar from '$lib/components/ui/avatar'
	import { Badge } from '$lib/components/ui/badge'
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import type { Shortener, Project } from '$lib/db/types'
	import {
		BarChart,
		EditIcon,
		ExternalLink,
		Loader2Icon,
		MoreVertical,
		QrCode,
		TrashIcon,
	} from 'lucide-svelte'
	import DeleteShortenerDialog from './DeleteShortenerDialog.svelte'
	import EditProjectLinkPage from '../links/[linkid]/edit/+page.svelte'
	import { goto, preloadData, pushState } from '$app/navigation'
	import { cn } from '$lib/utils'
	import type { page } from '$app/stores'

	export let shortener: Shortener & {
		visitorCount: number
	}
	export let shortener_url: string
	export let selected_project: Project

	let deleteDialogOpen = false
	let deleteShortenerCode = ''
	const openDeleteDialog = (code: string | number) => {
		deleteShortenerCode = code
		deleteDialogOpen = true
	}

	let editProjectLinkOpen = false
	let editData: typeof $page.state.editProjectLink

	const showEditModal = async (projectUuid: string, code: string) => {
		const href = `/dashboard/projects/${projectUuid}/links/${code}/edit`
		const result = await preloadData(href)

		if (result.type === 'loaded' && result.status === 200) {
			editData = result.data as typeof $page.state.editProjectLink
			editProjectLinkOpen = true
		} else {
			// something bad happened! try navigating
			goto(href)
		}
	}

	let isLoadingQrModal = false
	const showQRModal = async (e: MouseEvent) => {
		isLoadingQrModal = true
		const { href } = e.currentTarget as HTMLAnchorElement

		if (innerWidth < 640) goto(href)

		const result = await preloadData(href)

		if (result.type === 'loaded' && result.status === 200) {
			pushState(href, { projectLinkQR: result.data })
		} else {
			goto(href)
		}
		isLoadingQrModal = false
	}

	const shortenerUrl = selected_project.enable_custom_domain
		? selected_project.custom_domain || shortener_url
		: shortener_url
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="flex items-center justify-between gap-4">
			<Avatar.Root class="overflow-visible">
				<Avatar.Image
					src={'https://www.google.com/s2/favicons?sz=128&domain_url=' +
						shortener.link}
					alt="favicon" />
				<Avatar.Fallback class="bg-opacity-0">
					<img src="/favicon.png" alt="favicon" />
				</Avatar.Fallback>
			</Avatar.Root>
			<div class="flex flex-grow flex-col items-start gap-2">
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
							href={`/dashboard/projects/${selected_project.uuid}/links/${shortener.code}/edit`}
							on:click|preventDefault={() =>
								showEditModal(
									selected_project.uuid || '',
									shortener.code,
								)}>
							<DropdownMenu.Item class="flex items-center gap-2">
								<EditIcon size={16} />Edit
							</DropdownMenu.Item>
						</a>
						<DropdownMenu.Item
							on:click={() => openDeleteDialog(shortener.id)}
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
					href={`/dashboard/links/${shortener.code}`}
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
					href={`/dashboard/projects/${selected_project.uuid}/links/${shortener.code}/qr`}
					on:click|preventDefault={showQRModal}>
					{#if isLoadingQrModal}
						<Loader2Icon size={20} class="animate-spin" />
					{:else}
						<QrCode size={20} />
					{/if}
				</a>
				{#if shortener.ios}
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Badge variant="outline" class="flex gap-2">iOS</Badge>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>{shortener.ios_link}</p>
						</Tooltip.Content>
					</Tooltip.Root>
				{/if}
				{#if shortener.android}
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Badge variant="outline" class="flex gap-2">
								Android
							</Badge>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>{shortener.android_link}</p>
						</Tooltip.Content>
					</Tooltip.Root>
				{/if}
			</div>
			<div class="flex gap-4">
				{#if shortener.projectName}
					<Badge variant="secondary">{shortener.projectName}</Badge>
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
			<EditProjectLinkPage data={editData} shallowRouting />
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>
