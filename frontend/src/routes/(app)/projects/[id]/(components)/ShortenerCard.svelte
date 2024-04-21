<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Card from '$lib/components/ui/card'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Badge } from '$lib/components/ui/badge'
	import type { Shortener, Project, Setting } from '$lib/db/types'
	import {
		BarChart,
		ExternalLink,
		MoreVertical,
		QrCode,
	} from 'lucide-svelte'
	import DeleteShortenerDialog from './DeleteShortenerDialog.svelte'
	import Qr from '$lib/components/QR.svelte'
	import { goto, preloadData, pushState } from '$app/navigation'

	export let shortener: Shortener & {
		projectName: string | null
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

	let qrDialogOpen = false
	let qrCode = ''

	const openQRDialog = (code: string) => {
		qrCode = code
		qrDialogOpen = true
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
				{#if shortener.projectName}
					<Badge variant="secondary">{shortener.projectName}</Badge>
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
						<a
							href={`/projects/${selected_project.uuid}/links/${shortener.code}/edit`}
							on:click|preventDefault={showEditModal}>
							<DropdownMenu.Item>Edit</DropdownMenu.Item>
						</a>
						<DropdownMenu.Item
							on:click={() => openDeleteDialog(shortener.code)}
							class="text-destructive data-[highlighted]:bg-destructive">
							Delete
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</Card.Content>
</Card.Root>

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
				{shortener_url + '/' + qrCode}
			</Badge>
			<Qr
				bind:code={qrCode}
				value={shortener_url + '/' + qrCode}
				background={settings?.qr_background || '#fff'}
				color={settings?.qr_foreground || '#000'} />
		</div>
	</Dialog.Content>
</Dialog.Root>
