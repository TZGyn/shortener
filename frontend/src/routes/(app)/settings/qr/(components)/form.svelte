<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import { formSchema, type FormSchema } from '../schema'
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import SuperDebug from 'sveltekit-superforms'
	import { toast } from 'svelte-sonner'
	import DemoQr from './DemoQR.svelte'

	export let data: SuperValidated<Infer<FormSchema>>

	const form = superForm(data, {
		validators: zodClient(formSchema),
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

	const { form: formData, enhance } = form
</script>

<DemoQr
	background={$formData.qr_background}
	color={$formData.qr_foreground} />

<form method="POST" use:enhance class="flex flex-col gap-6">
	<Form.Field {form} name="qr_background" class="flex flex-col gap-2">
		<Form.Control let:attrs>
			<Form.Label>Background Color</Form.Label>
			<Input {...attrs} bind:value={$formData.qr_background} />
		</Form.Control>
		<Form.Description>QR Code background color</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="qr_foreground" class="flex flex-col gap-2">
		<Form.Control let:attrs>
			<Form.Label>Foreground Color</Form.Label>
			<Input {...attrs} bind:value={$formData.qr_foreground} />
		</Form.Control>
		<Form.Description>QR Code foreground color</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-fit">Save</Form.Button>
</form>
<SuperDebug data={formData} />
