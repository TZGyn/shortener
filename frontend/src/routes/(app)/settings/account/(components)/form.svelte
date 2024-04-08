<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import { Separator } from '$lib/components/ui/separator'
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
				toast.success('User settings updated')
			}
			if (result.status === 400 || result.status === 500) {
				toast.error('Error updating user settings')
			}
		},
	})

	const { form: formData, enhance } = form
</script>

<form method="POST" use:enhance class="flex flex-col gap-6">
	<Form.Field {form} name="username">
		<Form.Control let:attrs>
			<Form.Label>Username</Form.Label>
			<Input {...attrs} bind:value={$formData.username} />
		</Form.Control>
		<Form.Description>Change Your Username</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} disabled />
		</Form.Control>
		<Form.Description>Change Your Email</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Separator />
	<Form.Field {form} name="old_password">
		<Form.Control let:attrs>
			<Form.Label>Old Password</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.old_password}
				type="password" />
		</Form.Control>
		<Form.Description>Old Password To Confirm</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="new_password">
		<Form.Control let:attrs>
			<Form.Label>New Password</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.new_password}
				type="password" />
		</Form.Control>
		<Form.Description>Update Password</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="confirm_password">
		<Form.Control let:attrs>
			<Form.Label>Confirm Password</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.confirm_password}
				type="password" />
		</Form.Control>
		<Form.Description>Confirm New Password</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-fit">Save</Form.Button>
</form>
