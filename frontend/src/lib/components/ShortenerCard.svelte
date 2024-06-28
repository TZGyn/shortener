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
	import type { Shortener } from '$lib/db/types'
	import {
		BarChart,
		EditIcon,
		ExternalLink,
		MoreVertical,
		QrCode,
		TrashIcon,
	} from 'lucide-svelte'
	import DeleteShortenerDialog from './DeleteShortenerDialog.svelte'
	import EditLinkPage from '$lib/../routes/(app)/links/[id]/edit/+page.svelte'

	import { goto, preloadData, pushState } from '$app/navigation'
	import { cn } from '$lib/utils'
	import type { page } from '$app/stores'

	export let shortener: Shortener & {
		projectName: string | null
		projectUuid: string | null
		visitorCount: number
	}
	export let shortener_url: string

	let deleteDialogOpen = false
	let deleteShortenerCode = ''
	const openDeleteDialog = (code: string) => {
		deleteShortenerCode = code
		deleteDialogOpen = true
	}

	const getUrl = () => {
		if (shortener.projectUuid) {
			return `/projects/${shortener.projectUuid}`
		}
		return ''
	}

	let editProjectLinkOpen = false
	let editData: typeof $page.state.editLink

	const showEditModal = async (code: string) => {
		const href = `/links/${code}/edit`
		const result = await preloadData(href)

		if (result.type === 'loaded' && result.status === 200) {
			editData = result.data as typeof $page.state.editLink
			editProjectLinkOpen = true
		} else {
			// something bad happened! try navigating
			goto(href)
		}
	}

	const showQRModal = async (e: MouseEvent) => {
		const { href } = e.currentTarget as HTMLAnchorElement

		if (innerWidth < 640) goto(href)

		const result = await preloadData(href)

		if (result.type === 'loaded' && result.status === 200) {
			if (getUrl().startsWith('/projects')) {
				pushState(href, { projectLinkQR: result.data })
			} else {
				pushState(href, { linkQR: result.data })
			}
		} else {
			goto(href)
		}
	}

	const hostDomain = 'https://' + shortener.link.split('/')[2]
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="flex gap-4 justify-between items-center">
			<Avatar.Root class="overflow-visible">
				<Avatar.Image
					src={hostDomain + '/favicon.ico'}
					alt="favicon" />
				<Avatar.Fallback class="bg-opacity-0">
					<img src="/favicon.png" alt="favicon" />
				</Avatar.Fallback>
			</Avatar.Root>

			<div class="flex flex-col flex-grow gap-2 items-start">
				<Tooltip.Root>
					<Tooltip.Trigger>
						<div
							class="whitespace-nowrap max-w-[250px] overflow-x-clip overflow-ellipsis">
							{shortener.link}
						</div>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>{shortener.link}</p>
					</Tooltip.Content>
				</Tooltip.Root>

				<div
					class="flex gap-2 items-center text-sm text-muted-foreground">
					<a
						href={'https://' + shortener_url + '/' + shortener.code}
						target="_blank"
						class="hover:underline">
						{shortener_url + '/' + shortener.code}
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
							href={`/links/${shortener.code}/edit`}
							on:click|preventDefault={() =>
								showEditModal(shortener.code)}>
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
		</Card.Title>
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
					href={`${getUrl()}/links/${shortener.code}/qr`}
					on:click|preventDefault={showQRModal}>
					<QrCode size={20} />
				</a>
				<Separator orientation="vertical" />
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
			<EditLinkPage data={editData} shallowRouting />
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>
