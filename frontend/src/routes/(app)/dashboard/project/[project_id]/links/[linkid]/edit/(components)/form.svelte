<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import { Switch } from '$lib/components/ui/switch'
	import { formSchema, type FormSchema } from '../schema'
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { toast } from 'svelte-sonner'
	import { Loader2, LoaderCircle } from 'lucide-svelte'
	import { Checkbox } from '$lib/components/ui/checkbox'
	import { onMount } from 'svelte'

	let {
		data,
		projectId,
		linkId,
	}: {
		data: SuperValidated<Infer<FormSchema>>
		projectId: string
		linkId: string
	} = $props()

	const form = superForm(data, {
		validators: zodClient(formSchema),
		resetForm: false,
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success('Project shortener updated')
			}
		},
		onError: ({ result }) => {
			toast.error('Error updating shortener')
		},
	})

	const { form: formData, enhance, submitting } = form

	let inputTimer: any = $state()
	let previewData: any = $state()
	let isPreviewLoading: boolean = $state(false)

	const getMetadata = async () => {
		isPreviewLoading = true
		clearTimeout(inputTimer)
		const link =
			$formData.link.startsWith('https://') ||
			$formData.link.startsWith('http://')
				? $formData.link
				: 'https://' + $formData.link
		inputTimer = setTimeout(async () => {
			const response = await fetch(`/api/url/metadata?url=${link}`)
			previewData = await response.json()
			isPreviewLoading = false
			console.log(previewData)
		}, 1000)
	}

	onMount(() => {
		getMetadata()
	})
</script>

<div class="grid grid-cols-4 items-center gap-4 pb-4">
	<div class="font-bold">Preview</div>
	<div class="col-span-4 flex flex-col justify-center border">
		<div class="relative h-64 overflow-hidden">
			{#if isPreviewLoading}
				<div class="flex h-full items-center justify-center">
					<Loader2 class="animate-spin" />
				</div>
			{:else if previewData}
				<img
					src={previewData.image}
					alt=""
					class="h-64 w-full object-cover" />
				<div
					class="bg-secondary absolute bottom-2 left-2 rounded-lg px-2">
					{previewData.title}
				</div>
			{/if}
		</div>
	</div>
</div>
<form
	method="POST"
	use:enhance
	class="flex flex-col gap-6"
	action={`/dashboard/project/${projectId}/links/${linkId}/edit`}>
	<Form.Field {form} name="link" class="flex flex-col gap-2">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Link</Form.Label>
				<Input
					{...props}
					bind:value={$formData.link}
					placeholder="https://example.com"
					oninput={getMetadata} />
			{/snippet}
		</Form.Control>
		<Form.Description>Shortener link</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field
		{form}
		name="custom_code_enable"
		class="flex items-center gap-2 space-y-0">
		<Form.Control>
			{#snippet children({ props })}
				<Switch
					{...props}
					bind:checked={$formData.custom_code_enable} />
				<Form.Label>Custom Code</Form.Label>
			{/snippet}
		</Form.Control>
	</Form.Field>
	{#if $formData.custom_code_enable}
		<Form.Field {form} name="custom_code" class="flex flex-col gap-2">
			<Form.Control>
				{#snippet children({ props })}
					<Input
						{...props}
						bind:value={$formData.custom_code}
						placeholder="abcde" />
				{/snippet}
			</Form.Control>
			<Form.Description>
				Custom Code For The Shortener
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
	{/if}
	<Form.Field
		{form}
		name="ios"
		class="flex items-center gap-2 space-y-0">
		<Form.Control>
			{#snippet children({ props })}
				<Switch {...props} bind:checked={$formData.ios} />
				<Form.Label>iOS Link</Form.Label>
			{/snippet}
		</Form.Control>
	</Form.Field>
	{#if $formData.ios}
		<Form.Field {form} name="ios_link" class="flex flex-col gap-2">
			<Form.Control>
				{#snippet children({ props })}
					<Input
						{...props}
						bind:value={$formData.ios_link}
						placeholder="https://example.com" />
				{/snippet}
			</Form.Control>
			<Form.Description>Shortener link for iOS</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
	{/if}
	<Form.Field
		{form}
		name="android"
		class="flex items-center gap-2 space-y-0">
		<Form.Control>
			{#snippet children({ props })}
				<Switch {...props} bind:checked={$formData.android} />
				<Form.Label>Android Link</Form.Label>
			{/snippet}
		</Form.Control>
	</Form.Field>
	{#if $formData.android}
		<Form.Field
			{form}
			name="android_link"
			class="flex flex-col gap-2">
			<Form.Control>
				{#snippet children({ props })}
					<Input
						{...props}
						bind:value={$formData.android_link}
						placeholder="https://example.com" />
				{/snippet}
			</Form.Control>
			<Form.Description>Shortener link for Android</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
	{/if}
	<Form.Field
		{form}
		name="active"
		class="flex items-center gap-2 space-y-0">
		<Form.Control>
			{#snippet children({ props })}
				<Checkbox {...props} bind:checked={$formData.active} />
				<Form.Label>Active</Form.Label>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-fit">
		{#if $submitting}
			<LoaderCircle class="animate-spin" />
		{/if}
		Save
	</Form.Button>
</form>
