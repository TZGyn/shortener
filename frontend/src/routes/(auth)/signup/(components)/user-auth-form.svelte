<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'
	import Input from '$lib/components/ui/input/input.svelte'
	import Label from '$lib/components/ui/label/label.svelte'
	import { Loader2 } from 'lucide-svelte'
	import { goto } from '$app/navigation'

	let isLoading = false

	let email = ''
	let password = ''
	let password_confirm = ''

	const userSignUp = async () => {
		isLoading = true
		const response = await fetch('/api/signup', {
			method: 'post',
			body: JSON.stringify({
				email,
				password,
				password_confirm,
			}),
		})

		const data = await response.json()
		isLoading = false
		if (data.success) {
			goto('/')
		}
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex w-full max-w-sm flex-col gap-2">
		<Label for="email">Email</Label>
		<Input
			type="email"
			id="email"
			placeholder="name@example.com"
			bind:value={email} />
	</div>
	<div class="flex w-full max-w-sm flex-col gap-2">
		<Label for="password">Password</Label>
		<Input
			type="password"
			id="password"
			placeholder="••••••••"
			bind:value={password} />
	</div>
	<div class="flex w-full max-w-sm flex-col gap-2">
		<Label for="password_confirm">Password Confirm</Label>
		<Input
			type="password"
			id="password_confirm"
			placeholder="••••••••"
			bind:value={password_confirm} />
	</div>
	<Button
		disabled={isLoading}
		on:click={userSignUp}
		class="flex items-center gap-2">
		{#if isLoading}
			<Loader2 class="animate-spin" />
		{/if}
		Sign Up
	</Button>
</div>
