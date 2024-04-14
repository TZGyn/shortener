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
	import { toast } from 'svelte-sonner'

	export let data: SuperValidated<Infer<FormSchema>>

	const form = superForm(data, {
		validators: zodClient(formSchema),
		invalidateAll: 'force',
		resetForm: true,
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success('Project settings updated')
			}
			if (result.status === 400) {
				toast.error('Error updating project settings')
			}
		},
	})

	const { form: formData, enhance } = form
</script>

<form
	method="POST"
	use:enhance
	class="flex flex-col gap-4"
	action="?/update">
	<Form.Field {form} name="name" class="flex flex-col gap-2">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.Description>Update Project Name</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-fit">Save</Form.Button>
</form>
