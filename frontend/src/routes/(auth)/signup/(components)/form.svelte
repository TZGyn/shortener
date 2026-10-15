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
	import { onMount } from 'svelte'
	import { env } from '$env/dynamic/public'

	let { data }: { data: SuperValidated<Infer<FormSchema>> } = $props()

	const siteKey = env.PUBLIC_TURNSTILE_SITE_KEY

	let turnstileContainer: HTMLDivElement | undefined = $state()
	let turnstileWidgetId: string | undefined = undefined

	const resetTurnstile = () => {
		if (turnstileWidgetId) {
			window.turnstile?.reset(turnstileWidgetId)
		}
	}

	onMount(() => {
		const container = turnstileContainer
		if (!siteKey || !container) return

		const render = () => {
			turnstileWidgetId = window.turnstile?.render(container, {
				sitekey: siteKey,
			})
		}

		if (window.turnstile) {
			render()
			return
		}

		const script = document.createElement('script')
		script.src =
			'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
		script.async = true
		script.defer = true
		script.onload = render
		document.head.appendChild(script)
	})

	const form = superForm(data, {
		validators: zodClient(formSchema),
		resetForm: true,
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success(
					'Welcome to kon.sh, a verification email has been sent to your mailbox',
					{ duration: 10000 },
				)
			} else {
				resetTurnstile()
			}
		},
		onError: ({ result }) => {
			toast.error('Error signing up')
			resetTurnstile()
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
	{#if siteKey}
		<div bind:this={turnstileContainer}></div>
	{/if}
	<Form.Button>
		{#if $submitting}
			<LoaderCircle class="animate-spin" />
		{/if}
		Sign Up
	</Form.Button>
</form>
