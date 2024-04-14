<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import type { PageData } from './$types'
	import EditForm from './(components)/form.svelte'
	import * as Form from '$lib/components/ui/form'
	import { superForm } from 'sveltekit-superforms'
	import { toast } from 'svelte-sonner'
	import { Checkbox } from '$lib/components/ui/checkbox'
	import { Input } from '$lib/components/ui/input'

	export let data: PageData

	let deleteDialogOpen = false

	const form = superForm(data.deleteForm, {
		invalidateAll: 'force',
		resetForm: true,
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success('Project deleted')
				deleteDialogOpen = false
			}
			if (result.status === 400) {
				toast.error('Error deleting project')
			}
		},
	})

	const { form: formData, enhance } = form
</script>

<div class="py-4 px-10 space-y-6 max-w-2xl">
	<div>
		<h3 class="text-lg font-medium">Settings</h3>
		<p class="text-sm text-muted-foreground">
			Update project settings.
		</p>
	</div>
	<Separator />

	<EditForm data={data.form} />

	<Separator />

	<div>
		<h3 class="text-lg font-medium">Danger Zone</h3>
	</div>
	<div>
		<Dialog.Root
			open={deleteDialogOpen}
			onOpenChange={(open) => (deleteDialogOpen = open)}>
			<Dialog.Trigger>
				<Button variant="destructive">Delete Project</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
					<Dialog.Description>
						This action cannot be undone. This will permanently delete
						your project and all its associated data.
					</Dialog.Description>
				</Dialog.Header>
				<form method="POST" action="?/delete" use:enhance>
					<Form.Field
						{form}
						name="deleteShorteners"
						class="flex flex-col gap-2">
						<Form.Control let:attrs>
							<Input
								{...attrs}
								bind:value={$formData.deleteShorteners}
								type="hidden" />
							<div class="flex gap-2 items-center">
								<Checkbox
									{...attrs}
									id="deleteShorteners"
									bind:checked={$formData.deleteShorteners} />
								<Form.Label for="deleteShorteners"
									>Delete Shorteners</Form.Label>
							</div>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<div class="flex gap-2 justify-end">
						<Button
							variant="outline"
							on:click={() => (deleteDialogOpen = false)}
							>Cancel</Button>
						<Form.Button variant="destructive" class="w-fit"
							>Delete</Form.Button>
					</div>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</div>