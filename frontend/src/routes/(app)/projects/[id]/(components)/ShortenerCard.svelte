<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import * as Card from '$lib/components/ui/card'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import { Badge } from '$lib/components/ui/badge'
	import type { Shortener, Project, Setting } from '$lib/db/types'
	import {
		BarChart,
		EditIcon,
		ExternalLink,
		MoreVertical,
		QrCode,
		TrashIcon,
	} from 'lucide-svelte'
	import DeleteShortenerDialog from './DeleteShortenerDialog.svelte'
	import { goto, preloadData, pushState } from '$app/navigation'
	import { cn } from '$lib/utils'

	export let shortener: Shortener & {
		visitorCount: number
	}
	export let shortener_url: string
	export let settings: Setting | undefined
	export let selected_project: Project

	let deleteDialogOpen = false
	let deleteShortenerCode = ''
	const openDeleteDialog = (code: string) => {
		deleteShortenerCode = code
		deleteDialogOpen = true
	}

	const showEditModal = async (e: MouseEvent) => {
		// bail if opening a new tab, or we're on too small a screen
		if (innerWidth < 640) return

		// // prevent navigation
		// e.preventDefault()
		//
		const { href } = e.currentTarget as HTMLAnchorElement

		// run `load` functions (or rather, get the result of the `load` functions
		// that are already running because of `data-sveltekit-preload-data`)

		// const href = `/projects/${selected_project.uuid}/links/${shortener.code}/edit`
		const result = await preloadData(href)

		if (result.type === 'loaded' && result.status === 200) {
			pushState(href, { editProjectLink: result.data })
		} else {
			// something bad happened! try navigating
			goto(href)
		}
	}

	const showQRModal = async (e: MouseEvent) => {
		if (innerWidth < 640) return

		const { href } = e.currentTarget as HTMLAnchorElement
		const result = await preloadData(href)

		if (result.type === 'loaded' && result.status === 200) {
			pushState(href, { projectLinkQR: result.data })
		} else {
			goto(href)
		}
	}
</script>

<Card.Root class="w-full max-w-[500px]">
	<Card.Header>
		<Card.Title class="flex gap-2 justify-between items-center">
			<div class="flex gap-2 items-center">
				<a
					href={'https://' + shortener_url + '/' + shortener.code}
					target="_blank"
					class="hover:underline">
					{shortener_url + '/' + shortener.code}
				</a>
				<ExternalLink size={16} />
			</div>
			<div class="flex gap-4">
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
		<Card.Description>
			<div class="flex gap-2 items-center">
				<Tooltip.Root>
					<Tooltip.Trigger>
						<div
							class="overflow-hidden whitespace-nowrap max-w-[200px] overflow-ellipsis">
							{shortener.link}
						</div>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>{shortener.link}</p>
					</Tooltip.Content>
				</Tooltip.Root>
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
							<Badge variant="outline" class="flex gap-2"
								>Android</Badge>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>{shortener.android_link}</p>
						</Tooltip.Content>
					</Tooltip.Root>
				{/if}
			</div>
		</Card.Description>
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
				<a
					class={cn(
						buttonVariants({ variant: 'default' }),
						'flex h-8 items-center justify-center gap-1 rounded bg-secondary text-sm',
					)}
					href={`/projects/${selected_project.uuid}/links/${shortener.code}/qr`}
					on:click|preventDefault={showQRModal}>
					<QrCode size={20} />
				</a>
			</div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<MoreVertical />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<a
							href={`/projects/${selected_project.uuid}/links/${shortener.code}/edit`}
							on:click|preventDefault={showEditModal}>
							<DropdownMenu.Item class="flex gap-2 items-center">
								<EditIcon size={16} />Edit
							</DropdownMenu.Item>
						</a>
						<DropdownMenu.Item
							on:click={() => openDeleteDialog(shortener.code)}
							class="flex gap-2 items-center text-destructive data-[highlighted]:bg-destructive">
							<TrashIcon size={16} />
							Delete
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</Card.Content>
</Card.Root>

<DeleteShortenerDialog bind:deleteDialogOpen {deleteShortenerCode} />
