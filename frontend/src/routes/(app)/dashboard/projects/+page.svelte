<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Form from '$lib/components/ui/form'
	import * as Card from '$lib/components/ui/card'
	import { Input } from '$lib/components/ui/input'
	import { ExternalLink, Loader2, PlusCircle } from 'lucide-svelte'

	import { superForm } from 'sveltekit-superforms'
	import { formSchema } from './schema'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { toast } from 'svelte-sonner'

	let { data } = $props()

	let dialogOpen = $state(false)

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success(form.message)
				dialogOpen = false
			}
		},
	})

	const { form: formData, enhance, submitting } = form
</script>

<div class="flex items-center justify-start p-4">
	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Trigger
			class={buttonVariants({ variant: 'default' }) + 'flex gap-2'}>
			<PlusCircle />
			Add Project
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Add Project</Dialog.Title>
				<Dialog.Description>
					Create A New Project Here. Click Add To Create.
				</Dialog.Description>
			</Dialog.Header>
			<form method="POST" use:enhance>
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.Description>
						Enter a name for your project.
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<div class="flex justify-end gap-2">
					<Form.Button>
						{#if $submitting}
							<Loader2 class="animate-spin" />
						{/if}
						Add
					</Form.Button>
				</div>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>

{#if data.projects.length > 0}
	<div class="flex flex-wrap gap-4 overflow-scroll p-4">
		{#each data.projects as project}
			<a href={'/dashboard/projects/' + project.uuid}>
				<Card.Root
					class="hover:bg-secondary w-[500px] hover:cursor-pointer">
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							{project.name}
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="flex w-full justify-between">
							<Button
								class="bg-secondary flex h-8 items-center justify-center gap-1 rounded text-sm">
								<ExternalLink size={20} />
								{project.shortener.length}
								Shorteners
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			</a>
		{/each}
	</div>
{:else}
	<div class="flex flex-grow p-4">
		<div
			class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
			<div class="flex w-full flex-grow items-center justify-center">
				<div class="flex flex-col items-center gap-8">
					<div class="flex flex-col items-center gap-2">
						<div class="text-4xl font-bold">No Project Found</div>
						<p class="text-muted-foreground">Add a new project</p>
					</div>
					<Button
						onclick={() => {
							dialogOpen = true
						}}
						class="w-fit">
						Add Project
					</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
