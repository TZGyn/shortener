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
	import EditShortenerDialog from './EditShortenerDialog.svelte'
	import DeleteShortenerDialog from './DeleteShortenerDialog.svelte'
	import Qr from '$lib/components/QR.svelte'

	export let shortener: Shortener & {
		projectName: string
		visitorCount: number
	}
	export let shortener_url: string
	export let settings: Setting | undefined
	export let projects: Project[]

	let editDialogOpen = false
	let editShortenerCode = ''
	let editShortenerLink = ''
	let editShortenerCategory: any = undefined
	let editShortenerActive = false

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
						<DropdownMenu.Item
							on:click={() =>
								openEditDialog(
									shortener.code,
									shortener.link,
									shortener.projectId,
									shortener.projectName,
									shortener.active,
								)}>
							Edit
						</DropdownMenu.Item>
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

<EditShortenerDialog
	{projects}
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
