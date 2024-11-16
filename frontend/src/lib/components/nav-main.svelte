<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js'

	let {
		items,
	}: {
		items: {
			title: string
			url: string
			// this should be `Component` after lucide-svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon?: any
			isActive?: boolean
		}[]
	} = $props()
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Dashboard</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as item (item.title)}
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
