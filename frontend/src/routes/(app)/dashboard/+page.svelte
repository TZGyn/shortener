<script lang="ts">
	import type { PageData } from './$types'
	import * as Card from '$lib/components/ui/card'
	import { Button } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'
	import { BarChart, ExternalLink } from 'lucide-svelte'

	export let data: PageData
</script>

<div class="flex flex-col gap-4 px-10 py-8">
	<h2 class="text-2xl font-bold tracking-tight">Projects</h2>
	<Separator class="" />
</div>

<div class="flex w-full flex-wrap items-stretch gap-2 px-6">
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
					<div class="flex w-full gap-4">
						<Button
							class="bg-secondary flex h-8 items-center justify-center gap-1 rounded text-sm">
							<ExternalLink size={20} />
							{project.shortener.length}
							Shorteners
						</Button>
						<Button
							class="bg-secondary flex h-8 items-center justify-center gap-1 rounded text-sm">
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
