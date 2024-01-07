<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import type { PageData } from './$types'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Loader2 } from 'lucide-svelte'
	import { invalidateAll } from '$app/navigation'
	import { toast } from 'svelte-sonner'

	export let data: PageData

	let account_data = {
		username: data.user.username,
		email: data.user.email,
		old_password: '',
		new_password: '',
		confirm_password: '',
	}

	let isLoading = false

	const submit = async () => {
		isLoading = true

		const response = await fetch('/api/account', {
			method: 'PUT',
			body: JSON.stringify(account_data),
		})

		const body = await response.json()

		if (body.success) {
			toast.success('Account Details Updated')
			await invalidateAll()
		}

		isLoading = false
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

	<div class="flex w-full max-w-sm flex-col gap-2">
		<Label for="username">Username</Label>
		<Input
			type="text"
			id="username"
			bind:value={account_data.username} />
		<p class="text-muted-foreground text-sm">Change your username.</p>
	</div>

	<div class="flex w-full max-w-sm flex-col gap-2">
		<Label for="email">Email</Label>
		<Input
			disabled
			type="email"
			id="email"
			bind:value={account_data.email} />
		<p class="text-muted-foreground text-sm">Change your email.</p>
	</div>

	<Separator />

	<div class="flex w-full max-w-sm flex-col gap-2">
		<Label for="old_password">Old Password</Label>
		<Input
			type="password"
			id="old_password"
			bind:value={account_data.old_password} />
		<p class="text-muted-foreground text-sm">
			Enter your old password in order to change it.
		</p>
	</div>

	<div class="flex w-full max-w-sm flex-col gap-2">
		<Label for="old_password">New Password</Label>
		<Input
			type="password"
			id="new_password"
			bind:value={account_data.new_password} />
		<p class="text-muted-foreground text-sm">Change your password.</p>
	</div>

	<div class="flex w-full max-w-sm flex-col gap-2">
		<Label for="old_password">Confirm Password</Label>
		<Input
			type="password"
			id="new_password"
			bind:value={account_data.confirm_password} />
		<p class="text-muted-foreground text-sm">
			Confirm your new password.
		</p>
	</div>

	<Button disabled={isLoading} on:click={submit} class="flex gap-2">
		{#if isLoading}
			<Loader2 class="animate-spin" />
		{/if}
		Save</Button>
</div>
