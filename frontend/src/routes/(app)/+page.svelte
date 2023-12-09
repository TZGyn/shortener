<script lang="ts">
	import type { PageData } from './$types'
	import * as Card from '$lib/components/ui/card'
	import { Button } from '$lib/components/ui/button'

	export let data: PageData
</script>

<div class="flex flex-wrap gap-4 p-4">
	<div class="w-full">
		<h1 class="text-xl">Welcome to SvelteKit</h1>
		<p>
			Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read
			the documentation
		</p>
	</div>
	<Card.Root class="w-[500px]">
		<Card.Header>
			<Card.Title>Projects</Card.Title>
			<Card.Description>Projects</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="flex w-3/4 flex-col items-stretch gap-2">
				{#each data.projects as project}
					<Button href={'/projects/' + project.uuid}>
						{project.name}
					</Button>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
</div>
