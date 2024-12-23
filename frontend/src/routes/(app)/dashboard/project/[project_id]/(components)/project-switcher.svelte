<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import * as Sidebar from '$lib/components/ui/sidebar/index.js'
	import { useSidebar } from '$lib/components/ui/sidebar/index.js'
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down'
	import Plus from 'lucide-svelte/icons/plus'

	import * as Dialog from '$lib/components/ui/dialog'
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import { Loader2 } from 'lucide-svelte'

	import type { Project } from '$lib/db/types'
	import { toast } from 'svelte-sonner'
	import {
		type Infer,
		superForm,
		type SuperValidated,
	} from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { formSchema, type FormSchema } from './schema'

	let {
		activeProject,
		projects,
		createProjectForm,
	}: {
		activeProject?: Project
		projects: { name: string; logo: any; id: string }[]
		createProjectForm: SuperValidated<Infer<FormSchema>>
	} = $props()
	const sidebar = useSidebar()

	let dialogOpen = $state(false)

	const form = superForm(createProjectForm, {
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

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
						<div
							class="size-8 bg-sidebar-accent flex aspect-square items-center justify-center rounded-lg">
							<Avatar.Root class="size-6">
								<Avatar.Image src="/logo.png" alt="@shadcn" />
								<Avatar.Fallback>Kon</Avatar.Fallback>
							</Avatar.Root>
						</div>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">
								{activeProject?.name || 'Personal'}
							</span>
						</div>
						<ChevronsUpDown class="ml-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="min-w-56 w-[--bits-dropdown-menu-anchor-width] rounded-lg"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}>
				<DropdownMenu.Label class="text-muted-foreground text-xs">
					Default
				</DropdownMenu.Label>
				<a href={`/dashboard/project/personal`}>
					<DropdownMenu.Item class="gap-2 p-2">
						<div
							class="size-6 flex items-center justify-center rounded-sm border">
							<Avatar.Root class="size-4">
								<Avatar.Image src="/logo.png" alt="@shadcn" />
								<Avatar.Fallback>CN</Avatar.Fallback>
							</Avatar.Root>
						</div>
						Personal
					</DropdownMenu.Item>
				</a>
				<DropdownMenu.Separator />
				<DropdownMenu.Label class="text-muted-foreground text-xs">
					Projects
				</DropdownMenu.Label>
				{#each projects as project, index (project.name)}
					<a href={`/dashboard/project/${project.id}`}>
						<DropdownMenu.Item class="gap-2 p-2">
							<div
								class="size-6 flex items-center justify-center rounded-sm border">
								<Avatar.Root class="size-4">
									<Avatar.Image src="/logo.png" alt="@shadcn" />
									<Avatar.Fallback>CN</Avatar.Fallback>
								</Avatar.Root>
							</div>
							{project.name}
						</DropdownMenu.Item>
					</a>
				{/each}
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					class="gap-2 p-2 hover:cursor-pointer"
					onclick={() => (dialogOpen = true)}>
					<div
						class="bg-background size-6 flex items-center justify-center rounded-md border">
						<Plus class="size-4" />
					</div>
					<div class="text-muted-foreground font-medium">
						Add Project
					</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Project</Dialog.Title>
			<Dialog.Description>
				Create A New Project Here. Click Add To Create.
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" use:enhance action="/dashboard/project">
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name</Form.Label>
						<Input {...props} bind:value={$formData.name} />
					{/snippet}
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
