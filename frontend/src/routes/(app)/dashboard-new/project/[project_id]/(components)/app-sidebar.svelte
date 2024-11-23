<script lang="ts" module>
	import GalleryVerticalEnd from 'lucide-svelte/icons/gallery-vertical-end'
</script>

<script lang="ts">
	import NavUser from '$lib/components/nav-user.svelte'
	import ProjectSwitcher from './project-switcher.svelte'
	import * as Sidebar from '$lib/components/ui/sidebar/index.js'
	import type { ComponentProps } from 'svelte'
	import { HomeIcon, LinkIcon, SettingsIcon } from 'lucide-svelte'
	import { page } from '$app/stores'
	import type { User } from 'lucia'
	import type { Project } from '$lib/db/types'
	import { type FormSchema } from './schema'
	import {
		type SuperValidated,
		type Infer,
	} from 'sveltekit-superforms'

	let {
		ref = $bindable(null),
		activeProject,
		user,
		projects,
		createProjectForm,
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		activeProject?: Project
		user: User
		projects: Project[]
		createProjectForm: SuperValidated<Infer<FormSchema>>
	} = $props()

	let projectId = $derived(activeProject?.id || 'personal')

	let data = $derived({
		user: {
			name: user.username || '',
			email: user.email,
			avatar: '/avatars/shadcn.jpg',
			isPro: user.plan === 'pro' || user.plan === 'owner',
		},
		projects: projects.map((project) => ({
			name: project.name,
			logo: GalleryVerticalEnd,
			id: project.id,
		})),
		navMain: [
			{
				title: 'Overview',
				url: `/dashboard-new/project/${projectId}`,
				icon: HomeIcon,
				isActive:
					$page.url.pathname ===
					`/dashboard-new/project/${projectId}`,
			},
			{
				title: 'Links',
				url: `/dashboard-new/project/${projectId}/links`,
				icon: LinkIcon,
				isActive: $page.url.pathname.startsWith(
					`/dashboard-new/project/${projectId}/links`,
				),
			},
			{
				title: 'Settings',
				url:
					projectId === 'personal'
						? `/dashboard-new/account/settings`
						: `/dashboard-new/project/${projectId}/settings`,
				icon: SettingsIcon,
				isActive: $page.url.pathname.startsWith(
					`/dashboard-new/project/${projectId}/settings`,
				),
			},
		],
	})
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<ProjectSwitcher
			projects={data.projects}
			{createProjectForm}
			{activeProject} />
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>
				{activeProject?.name || 'Personal'}
			</Sidebar.GroupLabel>
			<Sidebar.Menu>
				{#each data.navMain as item (item.title)}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton isActive={item.isActive}>
							{#snippet child({ props })}
								<a href={item.url} {...props}>
									{#if item.icon}
										<item.icon class="h-8" />
									{/if}
									<span>{item.title}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
