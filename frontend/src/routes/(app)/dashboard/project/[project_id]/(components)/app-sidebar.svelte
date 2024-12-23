<script lang="ts" module>
	import GalleryVerticalEnd from 'lucide-svelte/icons/gallery-vertical-end'
</script>

<script lang="ts">
	import NavUser from '$lib/components/nav-user.svelte'
	import ProjectSwitcher from './project-switcher.svelte'
	import * as Sidebar from '$lib/components/ui/sidebar/index.js'
	import type { ComponentProps } from 'svelte'
	import {
		CloudDownloadIcon,
		CloudIcon,
		FileIcon,
		HomeIcon,
		LinkIcon,
		SettingsIcon,
	} from 'lucide-svelte'
	import { page } from '$app/stores'
	import type { User } from 'lucia'
	import type { Project } from '$lib/db/types'
	import { type FormSchema } from './schema'
	import {
		type SuperValidated,
		type Infer,
	} from 'sveltekit-superforms'
	import { Progress } from '$lib/components/ui/progress'
	import { byteToHumanReadable, cn } from '$lib/utils'
	import { Button } from '$lib/components/ui/button'

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

	const sidebar = Sidebar.useSidebar()

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
				url: `/dashboard/project/${projectId}`,
				icon: HomeIcon,
				isActive:
					$page.url.pathname === `/dashboard/project/${projectId}`,
				isUnlocked: true,
			},
			{
				title: 'Links',
				url: `/dashboard/project/${projectId}/links`,
				icon: LinkIcon,
				isActive: $page.url.pathname.startsWith(
					`/dashboard/project/${projectId}/links`,
				),
				isUnlocked: true,
			},
			{
				title: 'Files',
				url: `/dashboard/project/${projectId}/file_uploads`,
				icon: FileIcon,
				isActive: $page.url.pathname.startsWith(
					`/dashboard/project/${projectId}/file_uploads`,
				),
				isUnlocked: user.plan !== 'free',
			},
			{
				title: 'Settings',
				url:
					projectId === 'personal'
						? `/dashboard/account/settings`
						: `/dashboard/project/${projectId}/settings`,
				icon: SettingsIcon,
				isActive: $page.url.pathname.startsWith(
					`/dashboard/project/${projectId}/settings`,
				),
				isUnlocked: true,
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
								{#if item.isUnlocked}
									<a href={item.url} {...props}>
										{#if item.icon}
											<item.icon class="h-8" />
										{/if}
										<span>{item.title}</span>
									</a>
								{:else}
									<span
										{...props}
										class={cn(
											props.class as string,
											'text-muted-foreground select-none hover:cursor-pointer',
										)}>
										{#if item.icon}
											<item.icon class="h-8" />
										{/if}
										<span>{item.title}</span>
										<span class="text-brand">(Pro)</span>
									</span>
								{/if}
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		{#if sidebar.open && user.plan !== 'free'}
			<div class="flex flex-col gap-4 rounded-lg border p-4 text-sm">
				<div class="flex items-center gap-4">
					<CloudIcon />
					<span>Storage Usage</span>
				</div>
				<div class="flex flex-col gap-2">
					<span class="text-muted-foreground">
						{byteToHumanReadable(user.fileStorageUsageInByte)}
						/ 100 GB
					</span>
					<Progress
						max={100_000_000_000}
						value={user.fileStorageUsageInByte} />
				</div>
			</div>
		{/if}
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
