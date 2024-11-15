<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import { formSchema, verifyEmailSchema } from './schema'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { toast } from 'svelte-sonner'
	import { LoaderCircle, CheckIcon, XIcon } from 'lucide-svelte'
	import { Button } from '$lib/components/ui/button'

	let { data } = $props()

	const form = superForm(data.form, {
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

	const { form: formData, enhance, submitting } = form

	let isSubmittingVerifyEmail = $state(false)

	const verifyEmailForm = superForm(data.verify_email_form, {
		validators: zodClient(verifyEmailSchema),
		onUpdate: async ({ form }) => {
			if (!form.valid) {
				toast.error(form.message)
			} else {
				isSubmittingVerifyEmail = true
				await fetch('?/verify_email', { method: 'POST' })
				isSubmittingVerifyEmail = false
			}
		},
		onUpdated: ({ form }) => {
			if (form.valid) {
				// Successful post! Do some more client-side stuff,
				// like showing a toast notification.
				toast.success(form.message)
			}
		},
	})

	const { submit: submitVerifyEmail } = verifyEmailForm
</script>

<div class="flex h-auto flex-col gap-6">
	<div>
		<h3 class="text-lg font-medium">Account</h3>
		<p class="text-muted-foreground text-sm">
			Update your account settings.
		</p>
	</div>
	<Separator />

	<form
		method="POST"
		use:enhance
		class="flex flex-col gap-6"
		action="?/update">
		<Form.Field {form} name="username">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Username</Form.Label>
					<Input {...props} bind:value={$formData.username} />
				{/snippet}
			</Form.Control>
			<Form.Description>Change Your Username</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="flex items-center gap-1">
						Email
						<span
							class="text-muted-foreground flex items-end gap-1 text-sm">
							{#if data.user.email_verified}
								(verified)<CheckIcon class="text-success" size={18} />
							{:else}
								(unverified)<XIcon class="text-warning" size={18} />
							{/if}
						</span>
					</Form.Label>
					<div class="flex gap-2">
						<Input {...props} bind:value={$formData.email} disabled />
						<Button
							class="w-fit"
							onclick={submitVerifyEmail}
							disabled={isSubmittingVerifyEmail ||
								data.user.email_verified}>
							{#if isSubmittingVerifyEmail}
								<LoaderCircle class="animate-spin" />
							{/if}
							Verify
						</Button>
					</div>
				{/snippet}
			</Form.Control>
			<Form.Description>Change Your Email</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button class="w-fit self-end">
			{#if $submitting}
				<LoaderCircle class="animate-spin" />
			{/if}
			Save
		</Form.Button>
	</form>
</div>
