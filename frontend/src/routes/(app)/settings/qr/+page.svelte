<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import type { PageData } from './$types'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Loader2 } from 'lucide-svelte'
	import { invalidateAll } from '$app/navigation'
	import { toast } from 'svelte-sonner'
	import DemoQr from './(components)/DemoQR.svelte'

	export let data: PageData

	let isLoading = false

	let qr_data = {
		background_color: data.settings?.qr_background || '#fff',
		foreground_color: data.settings?.qr_foreground || '#000',
	}

	const submit = async () => {
		isLoading = true

		try {
			const response = await fetch('/api/account/qr', {
				method: 'PUT',
				body: JSON.stringify({
					qr_background: qr_data.background_color,
					qr_foreground: qr_data.foreground_color,
				}),
			})

			const body = await response.json()

			if (body.success) {
				toast.success('QR Details Updated')
				await invalidateAll()
			}
		} catch (error) {
			toast.error('Error Occurred')
		} finally {
			isLoading = false
		}
	}
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Account</h3>
		<p class="text-muted-foreground text-sm">
			Update your account settings.
		</p>
	</div>
	<Separator />

	{#key qr_data}
		<DemoQr
			background={qr_data.background_color}
			color={qr_data.foreground_color} />
	{/key}

	<div class="flex w-full max-w-sm flex-col gap-2">
		<Label for="background_color">Background Color</Label>
		<Input
			type="text"
			id="background_color"
			placeholder="#ffffff"
			bind:value={qr_data.background_color} />
	</div>

	<div class="flex w-full max-w-sm flex-col gap-2">
		<Label for="foreground_color">Foreground Color</Label>
		<Input
			type="text"
			id="foreground_color"
			placeholder="#000000"
			bind:value={qr_data.foreground_color} />
	</div>

	<Button disabled={isLoading} on:click={submit} class="flex gap-2">
		{#if isLoading}
			<Loader2 class="animate-spin" />
		{/if}
		Save</Button>
</div>
