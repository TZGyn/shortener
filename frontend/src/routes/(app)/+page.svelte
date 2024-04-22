<script lang="ts">
	import type { PageData } from './$types'
	import * as Card from '$lib/components/ui/card'
	import { Button } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'
	import { BarChart, ExternalLink } from 'lucide-svelte'

	export let data: PageData
</script>

<div class="flex flex-col gap-4 py-8 px-10">
	<h2 class="text-2xl font-bold tracking-tight">Projects</h2>
	<Separator class="" />
</div>

<div class="flex flex-wrap gap-2 items-stretch px-6 w-full">
	{#each data.projects as project}
		<a href={'/projects/' + project.uuid}>
			<Card.Root
				class="hover:cursor-pointer w-[500px] hover:bg-secondary">
				<Card.Header>
					<Card.Title class="flex gap-2 items-center">
						{project.name}
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="flex gap-4 w-full">
						<Button
							class="flex gap-1 justify-center items-center h-8 text-sm rounded bg-secondary">
							<ExternalLink size={20} />
							{project.shortener.length}
							Shorteners
						</Button>
						<Button
							class="flex gap-1 justify-center items-center h-8 text-sm rounded bg-secondary">
							<BarChart size={20} />
							{project.shortener.reduce(
								(curr, shortener) => shortener.visitor.length + curr,
								0,
							)}
							visits
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</a>
	{/each}
</div>
