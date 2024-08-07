<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js'
	import type { PageData } from './$types'
	import UserIcon from '$lib/components/UserIcon.svelte'
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import * as Breadcrumb from '$lib/components/ui/breadcrumb'
	import { page } from '$app/stores'
	import { Button } from '$lib/components/ui/button'
	import { Blocks, Home, Link, Settings } from 'lucide-svelte'

	export let data: PageData

	const routes = [
		{
			href: '/dashboard',
			name: 'Home',
			match: (path: string) => path === '/dashboard',
			icon: Home,
		},
		{
			href: '/dashboard/links',
			name: 'Links',
			match: (path: string) => path.startsWith('/dashboard/links'),
			icon: Link,
		},
		{
			href: '/dashboard/projects',
			name: 'Projects',
			match: (path: string) => path.startsWith('/dashboard/projects'),
			icon: Blocks,
		},
		{
			href: '/dashboard/settings/account',
			name: 'Settings',
			match: (path: string) => path.startsWith('/dashboard/settings'),
			icon: Settings,
		},
	] as const
</script>

<div
	class="max-w-screen flex h-screen max-h-screen w-screen overflow-hidden">
	<div class="bg-muted/40 flex max-w-[300px] flex-col border-r">
		<div
			class="flex w-full items-center justify-center gap-4 border-b px-2 py-2 lg:px-4">
			<UserIcon email={data.user.email} />

			<div class="hidden w-full lg:flex">
				<Breadcrumb.Root>
					<Breadcrumb.List>
						{#if $page.data.breadcrumbs}
							{#each $page.data.breadcrumbs as breadcrumb, index}
								{#if index == $page.data.breadcrumbs.length - 1}
									<Breadcrumb.Item>
										<Breadcrumb.Page href={breadcrumb.path}>
											{breadcrumb.name}
										</Breadcrumb.Page>
									</Breadcrumb.Item>
								{:else}
									<Breadcrumb.Item>
										<Breadcrumb.Link href={breadcrumb.path}>
											{breadcrumb.name}
										</Breadcrumb.Link>
									</Breadcrumb.Item>
								{/if}
								{#if index != $page.data.breadcrumbs.length - 1}
									<Breadcrumb.Separator />
								{/if}
							{/each}
						{:else}
							<Breadcrumb.Item>
								<Breadcrumb.Link href={'/'}>Home</Breadcrumb.Link>
							</Breadcrumb.Item>
						{/if}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</div>

		<div
			class={'flex h-full flex-col justify-between lg:min-w-[300px]'}>
			<div>
				<div class="flex flex-col gap-4 p-2 lg:p-4">
					<Select.Root
						selected={{
							label: $page.data.project?.name || 'None',
							value: $page.data.project?.id || 'none',
						}}>
						<Select.Trigger>
							<Select.Value placeholder="Select a project" />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Projects</Select.Label>
								<Select.Separator />
								<a href={`/dashboard/links`}>
									<Select.Item value={'none'} label={'None'}>
										None
									</Select.Item>
								</a>
								<Select.Separator />
								{#each data.projects as project}
									<a href={`/dashboard/projects/${project.uuid}`}>
										<Select.Item
											value={project.id}
											label={project.name}>
											{project.name}
										</Select.Item>
									</a>
								{/each}
							</Select.Group>
						</Select.Content>
						<Select.Input name="favoriteFruit" />
					</Select.Root>
					{#each routes as route}
						<Button
							variant={route.match($page.url.pathname)
								? 'secondary'
								: 'ghost'}
							href={route.href}
							class="hover:bg-secondary/50 flex items-center justify-start gap-4 text-base">
							<svelte:component this={route.icon} class="h-4 w-4" />
							<div class="hidden lg:flex">
								{route.name}
							</div>
						</Button>
					{/each}
				</div>
			</div>
		</div>
		<div
			class="flex items-center justify-center border-t px-2 py-4 lg:justify-end lg:px-4">
			<ThemeToggle />
		</div>
	</div>

	<div class="flex flex-grow overflow-hidden">
		<div class="flex h-auto w-full flex-col">
			<slot />
		</div>
	</div>
</div>
