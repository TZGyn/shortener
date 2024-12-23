<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import Dropzone from 'svelte-file-dropzone'
	import type { PageData } from './$types'
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte'
	import * as Card from '$lib/components/ui/card/index.js'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import {
		BarChartIcon,
		EllipsisVerticalIcon,
		ExternalLinkIcon,
		ImageIcon,
		Key,
		Loader2Icon,
		QrCodeIcon,
		TrashIcon,
		UploadIcon,
		XIcon,
	} from 'lucide-svelte'
	import { toast } from 'svelte-sonner'
	import {
		goto,
		invalidateAll,
		preloadData,
		pushState,
	} from '$app/navigation'
	import { byteToHumanReadable, cn } from '$lib/utils'
	import UploadFileCard from './(components)/upload-file-card.svelte'
	import { page } from '$app/stores'

	import { fade, fly } from 'svelte/transition'
	import { flip } from 'svelte/animate'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import * as Dialog from '$lib/components/ui/dialog/index.js'
	import ProjectLinkQRPage from '../links/[linkid]/qr/+page.svelte'

	let { data }: { data: PageData } = $props()

	let files = $state<{ accepted: File[]; rejected: File[] }>({
		accepted: [],
		rejected: [],
	})

	let deleteDialogOpen = $state(false)
	let deleteLoading = $state(false)
	let deleteKey = $state('')

	function handleFilesSelect(e: CustomEvent<any>) {
		const { acceptedFiles, fileRejections } = e.detail
		files.accepted = [...files.accepted, ...acceptedFiles]
		files.rejected = [...files.rejected, ...fileRejections]
	}

	const deleteFile = async (key: string) => {
		deleteLoading = true
		const response = await fetch(
			`/api/project/${data.activeProjectId}/file/${key}`,
			{
				method: 'DELETE',
			},
		)

		const body = await response.json()
		if (body.success) {
			invalidateAll()
			toast.success(`File Deleted: ${key}`)
		}
		deleteLoading = false
		deleteDialogOpen = false
	}

	const getFileDetails = async (key: string) => {
		const response = await fetch(
			`/api/project/${data.activeProjectId}/file/${key}`,
			{
				method: 'GET',
			},
		)

		const body = await response.json()
		console.log(body)
	}

	let isLoadingQrModal = $state(false)
	const showQRModal = async (e: MouseEvent) => {
		isLoadingQrModal = true
		const { href } = e.currentTarget as HTMLAnchorElement

		if (innerWidth < 640) goto(href)

		const result = await preloadData(href)

		if (result.type === 'loaded' && result.status === 200) {
			pushState(href, { newProjectLinkQR: result.data })
		} else {
			goto(href)
		}
		isLoadingQrModal = false
	}
</script>

<ScrollArea>
	<div class="flex flex-col gap-8 p-4">
		<Dropzone
			on:drop={(event) => handleFilesSelect(event)}
			class={'border-muted-foreground/25 hover:bg-muted/25 ring-offset-background focus-visible:ring-ring group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'}
			maxSize={5_000_000_000}
			disableDefaultStyles>
			<div
				class="flex flex-col items-center justify-center gap-4 sm:px-5">
				<div class="rounded-full border border-dashed p-3">
					<UploadIcon class="size-7 text-muted-foreground" />
				</div>
				<div class="flex flex-col gap-px">
					<p class="text-muted-foreground font-medium">
						Drag 'n' drop files here, or click to select files
					</p>
					<p class="text-muted-foreground/70 text-sm">
						You can upload multiple files (up to 5 GB each)
					</p>
				</div>
			</div>
		</Dropzone>
		{#if files.accepted.length > 0}
			<div class="flex flex-col gap-2">
				{#each files.accepted as acceptedFile, index (acceptedFile)}
					<div animate:flip in:fade out:fly={{ x: 100 }}>
						<UploadFileCard
							file={acceptedFile}
							uploadUrl={`/api/project/${data.activeProjectId}/file`}
							delete={() => {
								files.accepted.splice(index, 1)
							}} />
					</div>
				{/each}
			</div>
		{/if}

		<Card.Root>
			<Card.Header>
				<Card.Title>Uploaded files</Card.Title>
				<Card.Description>
					View the uploaded files here
				</Card.Description>
			</Card.Header>
			<Card.Content>
				{#await data.files}
					<Skeleton class="h-16" />
				{:then files}
					{#if files}
						<div
							class="grid grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] gap-3">
							{#each files as file}
								<Card.Root>
									<Card.Content
										class="flex h-full items-end justify-between gap-2">
										<div
											class="flex h-full flex-1 flex-col gap-4 overflow-hidden text-ellipsis">
											<div>
												<span>
													{file.name}
												</span>
												<div class="text-muted-foreground">
													{byteToHumanReadable(file.size)}
												</div>
												<div
													class="text-muted-foreground flex items-center gap-2 text-sm">
													<a
														href={'https://' +
															data.shortener_url +
															'/' +
															file.shortener.code}
														target="_blank"
														class="hover:underline">
														{data.shortener_url +
															'/' +
															file.shortener.code}
													</a>
													<ExternalLinkIcon size={16} />
												</div>
											</div>
											<div class="flex items-center justify-between">
												<div class="flex gap-2">
													<Button
														href={`/dashboard/project/${data.activeProjectId}/links/${file.shortener.id}`}
														class="bg-secondary flex h-8 items-center justify-center gap-1 rounded text-sm">
														<BarChartIcon size={20} />
														<div>Analytics</div>
													</Button>
													<a
														class={cn(
															buttonVariants({ variant: 'default' }),
															'bg-secondary flex h-8 items-center justify-center gap-1 rounded text-sm',
														)}
														href={`/dashboard/project/${data.activeProjectId}/links/${file.shortener.id}/qr`}
														onclick={(event) => {
															event.preventDefault()
															showQRModal(event)
														}}>
														{#if isLoadingQrModal}
															<Loader2Icon
																size={20}
																class="animate-spin" />
														{:else}
															<QrCodeIcon size={20} />
														{/if}
													</a>
												</div>
												<DropdownMenu.Root>
													<DropdownMenu.Trigger>
														<EllipsisVerticalIcon />
													</DropdownMenu.Trigger>
													<DropdownMenu.Content>
														<DropdownMenu.Group>
															<DropdownMenu.Item
																onclick={() =>
																	getFileDetails(file.name)}>
																Details
															</DropdownMenu.Item>
															<DropdownMenu.Item
																class="text-destructive data-[highlighted]:bg-destructive flex items-center gap-2"
																onclick={() => {
																	deleteKey = file.name
																	deleteDialogOpen = true
																}}>
																Delete
															</DropdownMenu.Item>
														</DropdownMenu.Group>
													</DropdownMenu.Content>
												</DropdownMenu.Root>
											</div>
										</div>
									</Card.Content>
								</Card.Root>
							{/each}
						</div>
					{:else}
						<div
							class="text-card-foreground flex w-full flex-col items-center justify-center space-y-6 rounded-xl border bg-transparent p-16 shadow">
							<div
								class="mr-4 shrink-0 rounded-full border border-dashed p-4">
								<ImageIcon class="size-8 text-muted-foreground" />
							</div>
							<div
								class="flex flex-col items-center gap-1.5 text-center">
								<h3 class="font-semibold leading-none tracking-tight">
									No files uploaded
								</h3>
								<p class="text-muted-foreground text-sm">
									Upload some files to see them here
								</p>
							</div>
						</div>
					{/if}
				{/await}
			</Card.Content>
		</Card.Root>
	</div>
</ScrollArea>

<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content>
		<Dialog.Header class="space-y-12">
			<div
				class="flex w-full flex-col items-center justify-center gap-6 pt-12">
				<div class="bg-destructive/30 w-fit rounded-full p-4">
					<TrashIcon class="text-destructive" size={64} />
				</div>
			</div>
			<div class="space-y-2">
				<Dialog.Title class="text-center">
					Delete File {deleteKey}?
				</Dialog.Title>
				<Dialog.Description class="text-center">
					Files And Their Shortener Will Be Permanently Deleted
				</Dialog.Description>
			</div>
			<div class="flex justify-center gap-6">
				<Button
					variant="outline"
					class="w-full"
					onclick={() => {
						deleteDialogOpen = false
					}}
					disabled={deleteLoading}>
					Cancel
				</Button>
				<Button
					variant="destructive"
					onclick={() => deleteFile(deleteKey)}
					class="flex w-full gap-2"
					disabled={deleteLoading}>
					{#if deleteLoading}
						<Loader2Icon class="animate-spin" />
					{/if}
					Delete File
				</Button>
			</div>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root
	open={!!$page.state.newProjectLinkQR}
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
				data={$page.state.newProjectLinkQR}
				shallowRouting />
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>
