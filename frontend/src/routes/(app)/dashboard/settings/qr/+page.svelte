<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import type { PageData } from './$types'
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import { formSchema } from './schema'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { toast } from 'svelte-sonner'
	import DemoQr from './(components)/DemoQR.svelte'
	import { LoaderCircle } from 'lucide-svelte'

	export let data: PageData

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		invalidateAll: 'force',
		resetForm: true,
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success('QR settings updated')
			}
			if (result.status === 400) {
				toast.error('Error updating QR settings')
			}
		},
	})

	const { form: formData, enhance, submitting } = form
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">QR</h3>
		<p class="text-sm text-muted-foreground">
			Update your QR settings.
		</p>
	</div>
	<Separator />

	<DemoQr
		background={$formData.qr_background}
		color={$formData.qr_foreground} />

	<form method="POST" use:enhance class="flex flex-col gap-6">
		<Form.Field {form} name="qr_background">
			<Form.Control let:attrs>
				<Form.Label>Background Color</Form.Label>
				<Input {...attrs} bind:value={$formData.qr_background} />
			</Form.Control>
			<Form.Description>QR Code background color</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="qr_foreground">
			<Form.Control let:attrs>
				<Form.Label>Foreground Color</Form.Label>
				<Input {...attrs} bind:value={$formData.qr_foreground} />
			</Form.Control>
			<Form.Description>QR Code foreground color</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button class="w-fit">
			{#if $submitting}
				<LoaderCircle class="animate-spin" />
			{/if}
			Save
		</Form.Button>
	</form>
</div>
