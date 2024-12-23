<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { Button } from '$lib/components/ui/button'
	import * as Card from '$lib/components/ui/card'
	import { Progress } from '$lib/components/ui/progress'
	import { byteToHumanReadable, cn } from '$lib/utils'
	import { RotateCwIcon, XIcon } from 'lucide-svelte'
	import { onMount } from 'svelte'
	import { toast } from 'svelte-sonner'

	let {
		file,
		uploadUrl,
		delete: deleteCard,
	}: { file: File; uploadUrl: string; delete: () => void } = $props()

	let uploadProgress = $state(0)
	let uploadMax = $state(1)

	let isCancelled = $state(false)
	let isCompleted = $state(false)

	const xhr = new XMLHttpRequest()

	const upload = async () => {
		// return
		toast.info(`Uploading: ${file.name}`)
		const response = await fetch(uploadUrl, {
			method: 'POST',
			body: JSON.stringify({
				fileName: file.name,
				fileSize: file.size,
				fileType: file.type,
			}),
		})

		const body = await response.json()

		// https://stackoverflow.com/questions/35711724/upload-progress-indicators-for-fetch
		const success = await new Promise((resolve) => {
			xhr.upload.addEventListener('progress', (event) => {
				if (event.lengthComputable) {
					uploadProgress = event.loaded
					uploadMax = event.total
				}
			})
			xhr.addEventListener('loadend', () => {
				resolve(xhr.readyState === 4 && xhr.status === 200)
			})
			xhr.open('PUT', body.link, true)
			xhr.setRequestHeader('Content-Type', file.type)
			xhr.send(file)
		})
		console.log('success:', success)

		if ((success as boolean) === true) {
			isCompleted = true
			setTimeout(() => {
				invalidateAll()
			}, 3000)
			toast.success(`File Uploaded: ${file.name}`)
		}
	}

	$effect(() => {
		if (isCompleted) {
			setTimeout(() => {
				deleteCard()
			}, 2000)
		}
	})

	onMount(() => {
		upload()
	})
</script>

<Card.Root>
	<Card.Content class="flex items-center justify-between gap-4">
		<div class="flex w-full flex-col gap-2">
			<div>
				<span>
					{file.name}
				</span>
				<span class="text-muted-foreground">
					{byteToHumanReadable(file.size)}
				</span>
				{#if isCancelled}
					<span class="text-destructive">(Cancelled)</span>
				{:else}
					<span
						class={cn(
							'text-brand',
							uploadProgress / uploadMax === 1 && 'text-success',
						)}>
						({((uploadProgress / uploadMax) * 100).toFixed(1)} %)
					</span>
				{/if}
			</div>
			<Progress value={uploadProgress} max={uploadMax} class="h-2" />
		</div>
		{#if !isCancelled || isCompleted}
			<Button
				variant="outline"
				disabled={isCompleted}
				onclick={() => {
					xhr.abort()
					isCancelled = true
					toast.error(`Upload Cancelled: ${file.name}`)
				}}
				size="icon">
				<XIcon />
			</Button>
		{:else}
			<Button
				variant="outline"
				onclick={() => {
					upload()
					isCancelled = false
					toast.info(`Upload Retry: ${file.name}`)
				}}
				size="icon">
				<RotateCwIcon />
			</Button>
		{/if}
	</Card.Content>
</Card.Root>
