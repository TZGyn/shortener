<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Select from '$lib/components/ui/select'
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
	import { Loader2, LoaderCircle, PlusCircle } from 'lucide-svelte'
	import { buttonVariants } from '$lib/components/ui/button'
	import { Checkbox } from '$lib/components/ui/checkbox'
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import type { Project } from '$lib/db/types'

	export let data: SuperValidated<Infer<FormSchema>>
	export let projects: Project[]
	export let dialogOpen: boolean
	let shortenerCategory: any = undefined

	const form = superForm(data, {
		validators: zodClient(formSchema),
		invalidateAll: 'force',
		resetForm: true,
		onResult: ({ result }) => {
			if (result.status === 200) {
				dialogOpen = false
				toast.success('Shortener added to project')
			}
		},
		onError: ({ result }) => {
			toast.error('Error adding shortener')
		},
	})

	const { form: formData, enhance, submitting } = form

	let inputTimer: any
	let previewData: any
	let isPreviewLoading: boolean = false

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
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'default' }) + 'flex gap-2'}>
		<PlusCircle />
		Add Shortner
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>Add Shortener</Dialog.Title>
			<Dialog.Description>
				Create A New Shortener Here. Click Add To Save.
			</Dialog.Description>
		</Dialog.Header>
		<ScrollArea class="max-h-[calc(100vh-200px)]">
			<div class="grid grid-cols-4 gap-4 items-center pb-4">
				<div class="font-bold">Preview</div>
				<div class="flex flex-col col-span-4 justify-center border">
					<div class="overflow-hidden relative h-64">
						{#if isPreviewLoading}
							<div class="flex justify-center items-center h-full">
								<Loader2 class="animate-spin" />
							</div>
						{:else if previewData}
							<img
								src={previewData.image}
								alt=""
								class="object-cover w-full h-64" />
							<div
								class="absolute bottom-2 left-2 px-2 rounded-lg bg-secondary">
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
				action="?/create">
				<Form.Field {form} name="link" class="flex flex-col gap-2">
					<Form.Control let:attrs>
						<Form.Label>Link</Form.Label>
						<Input
							{...attrs}
							bind:value={$formData.link}
							placeholder="https://example.com"
							on:input={getMetadata} />
					</Form.Control>
					<Form.Description>Shortener link</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="project" class="flex flex-col gap-2">
					<Form.Control let:attrs>
						<Form.Label>Project</Form.Label>
						<Select.Root
							bind:selected={shortenerCategory}
							onSelectedChange={(v) => {
								v && ($formData.project = v.value)
							}}
							multiple={false}>
							<Select.Trigger {...attrs} class="col-span-3">
								<Select.Value placeholder="Select a Project" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value={''}>None</Select.Item>
								<Select.Separator />
								<Select.Group>
									{#each projects as project}
										<Select.Item value={project.uuid}>
											{project.name}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
						<input
							hidden
							bind:value={$formData.project}
							name={attrs.name} />
					</Form.Control>
					<Form.Description>Shortener Project</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field
					{form}
					name="ios"
					class="flex gap-2 items-center space-y-0">
					<Form.Control let:attrs>
						<Form.Label>iOS Link</Form.Label>
						<Switch {...attrs} bind:checked={$formData.ios} />
					</Form.Control>
				</Form.Field>
				{#if $formData.ios}
					<Form.Field
						{form}
						name="ios_link"
						class="flex flex-col gap-2">
						<Form.Control let:attrs>
							<Input
								{...attrs}
								bind:value={$formData.ios_link}
								placeholder="https://example.com" />
						</Form.Control>
						<Form.Description
							>Shortener link for iOS</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				{/if}
				<Form.Field
					{form}
					name="android"
					class="flex gap-2 items-center space-y-0">
					<Form.Control let:attrs>
						<Form.Label>Android Link</Form.Label>
						<Switch {...attrs} bind:checked={$formData.android} />
					</Form.Control>
				</Form.Field>
				{#if $formData.android}
					<Form.Field
						{form}
						name="android_link"
						class="flex flex-col gap-2">
						<Form.Control let:attrs>
							<Input
								{...attrs}
								bind:value={$formData.android_link}
								placeholder="https://example.com" />
						</Form.Control>
						<Form.Description
							>Shortener link for Android</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				{/if}
				<Form.Field
					{form}
					name="active"
					class="flex gap-2 items-center space-y-0">
					<Form.Control let:attrs>
						<Checkbox {...attrs} bind:checked={$formData.active} />
						<Form.Label>Active</Form.Label>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button class="w-fit">
					{#if $submitting}
						<LoaderCircle class="animate-spin" />
					{/if}
					Add
				</Form.Button>
			</form>
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>
