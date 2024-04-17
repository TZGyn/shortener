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
				toast.success('Signup success')
			}
		},
		onError: ({ result }) => {
			toast.error('Error signing up')
		},
	})

	const { form: formData, enhance } = form
</script>

<form method="POST" use:enhance class="flex flex-col gap-4">
	<Form.Field {form} name="email" class="flex flex-col gap-2">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.email}
				placeholder="name@example.com" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password" class="flex flex-col gap-2">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input
				{...attrs}
				type="password"
				bind:value={$formData.password}
				placeholder="••••••••" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field
		{form}
		name="password_confirm"
		class="flex flex-col gap-2">
		<Form.Control let:attrs>
			<Form.Label>Password Confirm</Form.Label>
			<Input
				{...attrs}
				type="password"
				bind:value={$formData.password_confirm}
				placeholder="••••••••" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Sign Up</Form.Button>
</form>
