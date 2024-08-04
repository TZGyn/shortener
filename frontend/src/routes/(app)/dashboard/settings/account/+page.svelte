<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import { formSchema, verifyEmailSchema } from './schema'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { toast } from 'svelte-sonner'
	import { LoaderCircle, CheckIcon, XIcon } from 'lucide-svelte'

	export let data

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

	const verifyEmailForm = superForm(data.verify_email_form, {
		validators: zodClient(verifyEmailSchema),
		onUpdate: ({ form }) => {
			if (!form.valid) {
				toast.error(form.message)
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

	const {
		form: verifyEmailFormData,
		enhance: enhanceVerifyEmail,
		submitting: submittingVerifyEmail,
	} = verifyEmailForm
</script>

<div class="flex h-auto flex-col gap-6">
	<div>
		<h3 class="text-lg font-medium">Account</h3>
		<p class="text-sm text-muted-foreground">
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
			<Form.Control let:attrs>
				<Form.Label>Username</Form.Label>
				<Input {...attrs} bind:value={$formData.username} />
			</Form.Control>
			<Form.Description>Change Your Username</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label class="flex items-center gap-1">
					Email
					<span
						class="flex items-end gap-1 text-sm text-muted-foreground">
						{#if data.user.email_verified}
							(verified)<CheckIcon class="text-success" size={18} />
						{:else}
							(unverified)<XIcon class="text-warning" size={18} />
						{/if}
					</span>
				</Form.Label>
				<div class="flex gap-2">
					<Input {...attrs} bind:value={$formData.email} disabled />
					<form
						method="POST"
						use:enhanceVerifyEmail
						class="flex flex-col gap-6"
						action="?/verify_email">
						<Form.Button
							class="w-fit"
							disabled={$submittingVerifyEmail ||
								data.user.email_verified}>
							{#if $submittingVerifyEmail}
								<LoaderCircle class="animate-spin" />
							{/if}
							Verify
						</Form.Button>
					</form>
				</div>
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
		<Form.Button class="w-fit">
			{#if $submitting}
				<LoaderCircle class="animate-spin" />
			{/if}
			Save
		</Form.Button>
	</form>
</div>
