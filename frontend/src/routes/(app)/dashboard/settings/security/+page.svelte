<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import { changePasswordFormSchema } from './schema'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { toast } from 'svelte-sonner'
	import { LoaderCircle } from 'lucide-svelte'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Button } from '$lib/components/ui/button'

	let { data } = $props()

	const form = superForm(data.form, {
		validators: zodClient(changePasswordFormSchema),
		invalidateAll: 'force',
		resetForm: true,
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success('Password Changed')
			}
			if (result.status === 400 || result.status === 500) {
				toast.error('Failed to change password')
			}
		},
	})

	const { form: formData, enhance, submitting } = form

	let deleteDialogOpen = $state(false)

	const deleteAccountForm = superForm(data.deleteAccountForm, {
		invalidateAll: 'force',
		resetForm: true,
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success('Account deleted')
				deleteDialogOpen = false
			}
			if (result.status === 400) {
				toast.error('Failed to delete account')
			}
		},
	})

	const {
		form: deleteAccountFormData,
		enhance: deleteAccountEnhance,
		submitting: deleteAccountSubmitting,
	} = deleteAccountForm
</script>

<div class="flex h-auto flex-col gap-6">
	<div>
		<h3 class="text-lg font-medium">Password</h3>
		<p class="text-muted-foreground text-sm">Update your password</p>
	</div>
	<Separator />

	<form
		method="POST"
		use:enhance
		class="flex flex-col gap-6"
		action="?/change_password">
		<Form.Field {form} name="old_password">
			<Form.Control let:attrs>
				<Form.Label>Old Password</Form.Label>
				<Input
					{...attrs}
					bind:value={$formData.old_password}
					type="password"
					placeholder="••••••••" />
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
					type="password"
					placeholder="••••••••" />
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
					type="password"
					placeholder="••••••••" />
			</Form.Control>
			<Form.Description>Confirm New Password</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button class="w-fit self-end">
			{#if $submitting}
				<LoaderCircle class="animate-spin" />
			{/if}
			Change Password
		</Form.Button>
	</form>

	<Separator />

	<div>
		<h3 class="text-lg font-medium">Danger Zone</h3>
		<p class="text-muted-foreground text-sm">
			Changes here are irreversible
		</p>
	</div>
	<Separator />

	<div class="border-destructive rounded-lg border">
		<div class="flex items-center justify-between p-4">
			<div class="flex flex-col gap-1">
				<span class="text-sm">Delete Account</span>
				<span class="text-muted-foreground text-xs">
					Permanently delete your account and all data
				</span>
			</div>
			<Dialog.Root bind:open={deleteDialogOpen}>
				<Dialog.Trigger>
					<Button variant="destructive">Delete Account</Button>
				</Dialog.Trigger>
				<Dialog.Content class="max-w-xl">
					<Dialog.Header class="flex-row items-center gap-2">
						<div class="h-fit w-fit p-2">
							<img src="/logo.png" alt="" class="h-8 w-8" />
						</div>
						<div>
							<Dialog.Title>Delete Account</Dialog.Title>
							<Dialog.Description>
								This will permanently delete your account and all its
								associated data.
							</Dialog.Description>
						</div>
					</Dialog.Header>
					<form
						method="POST"
						action="?/delete_account"
						use:deleteAccountEnhance>
						<Form.Field form={deleteAccountForm} name="password">
							<Form.Control let:attrs>
								<Form.Label>Password</Form.Label>
								<Input
									{...attrs}
									bind:value={$deleteAccountFormData.password}
									type="password"
									placeholder="••••••••" />
							</Form.Control>
							<Form.Description>
								Enter your password to delete account
							</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
						<div class="flex justify-end gap-2">
							<Button
								variant="outline"
								onclick={() => (deleteDialogOpen = false)}>
								Cancel
							</Button>
							<Form.Button variant="destructive" class="w-fit">
								{#if $deleteAccountSubmitting}
									<LoaderCircle class="animate-spin" />
								{/if}
								Delete
							</Form.Button>
						</div>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>
</div>
