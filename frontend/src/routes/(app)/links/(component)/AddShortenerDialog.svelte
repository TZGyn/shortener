<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog'
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Loader2, PlusCircle } from 'lucide-svelte'
	import { invalidateAll } from '$app/navigation'
	import { toast } from 'svelte-sonner'

	export let dialogOpen: boolean
	let inputLink = ''
	let isLoading = false

	const addShortener = async () => {
		isLoading = true

		const response = await fetch('/api/shortener', {
			method: 'post',
			body: JSON.stringify({ link: inputLink }),
		})

		const responseData = await response.json()

		isLoading = false

		if (responseData.success) {
			toast.success('Successfully Created Shortener')
			await invalidateAll()
			dialogOpen = false
		}
	}

	let inputTimer: any
	let data: any

	const getMetadata = async () => {
		clearTimeout(inputTimer)
		inputTimer = setTimeout(async () => {
			const response = await fetch(
				`/api/url/metadata?url=${inputLink}`,
			)
			data = await response.json()
			console.log(data)
		}, 1000)
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'default' }) + 'flex gap-2'}>
		<PlusCircle />
		Add Shortner
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>Add Shortener</Dialog.Title>
			<Dialog.Description>
				Create A New Shortner Here. Click Add To Save.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-8 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label>Link</Label>
				<Input
					id="name"
					on:input={() => getMetadata()}
					bind:value={inputLink}
					placeholder="https://example.com"
					class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<div class="font-bold">Preview</div>
				<div class="col-span-4 flex flex-col justify-center border">
					<div class="relative h-64 overflow-hidden">
						{#if data}
							<img
								src={data.image}
								alt=""
								class="h-64 w-full object-cover" />
							<div
								class="bg-secondary absolute bottom-2 left-2 rounded-lg px-2">
								{data.title}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button on:click={addShortener} class="flex gap-2">
				{#if isLoading}
					<Loader2 class="animate-spin" />
				{/if}
				Add
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
