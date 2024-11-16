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
	import { LoaderCircle } from 'lucide-svelte'

	let { data }: { data: SuperValidated<Infer<FormSchema>> } = $props()

	const form = superForm(data, {
		validators: zodClient(formSchema),
		resetForm: true,
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success(
					'Welcome to kon.sh, a verification email has been sent to your mailbox',
					{ duration: 10000 },
				)
			}
		},
		onError: ({ result }) => {
			toast.error('Error signing up')
		},
	})

	const { form: formData, enhance, submitting } = form
</script>

<form method="POST" use:enhance class="flex flex-col gap-4">
	<Form.Field {form} name="email" class="flex flex-col gap-2">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input
					{...props}
					bind:value={$formData.email}
					placeholder="name@example.com" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password" class="flex flex-col gap-2">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input
					{...props}
					type="password"
					bind:value={$formData.password}
					placeholder="••••••••" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field
		{form}
		name="password_confirm"
		class="flex flex-col gap-2">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password Confirm</Form.Label>
				<Input
					{...props}
					type="password"
					bind:value={$formData.password_confirm}
					placeholder="••••••••" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>
		{#if $submitting}
			<LoaderCircle class="animate-spin" />
		{/if}
		Sign Up
	</Form.Button>
</form>
