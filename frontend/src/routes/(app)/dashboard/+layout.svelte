<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte'
	import type { PageData } from './$types'
	import UserIcon from '$lib/components/UserIcon.svelte'
	import ThemeToggle from '$lib/components/theme-toggle.svelte'
	import * as Breadcrumb from '$lib/components/ui/breadcrumb'
	import { page } from '$app/stores'

	export let data: PageData
</script>

<div
	class="max-w-screen flex h-screen max-h-screen w-screen overflow-hidden">
	<div class="flex max-w-[300px] flex-col border-r bg-muted/40">
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

		<Sidebar />
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
