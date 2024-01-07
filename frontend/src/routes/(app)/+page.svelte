<script lang="ts">
	import type { PageData } from './$types'
	import * as Card from '$lib/components/ui/card'
	import { Button } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'
	import { BarChart } from 'lucide-svelte'

	export let data: PageData
</script>

<div class="flex min-h-[80px] items-center justify-between p-4">
	<div class="text-3xl font-bold">Dashboard</div>
</div>
<Separator />

<div class="flex flex-wrap gap-4 p-4">
	<Card.Root class="w-[500px]">
		<Card.Header>
			<Card.Title>Projects</Card.Title>
			<Card.Description>Projects</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="flex w-full flex-col items-stretch gap-2">
				{#each data.projects as project}
					<div class="flex w-full items-center justify-between gap-2">
						<Button
							href={'/links?project=' + project.uuid}
							class="w-3/4">
							{project.name}
						</Button>
						<div class="flex gap-2">
							<BarChart />
							{project.shortener.reduce(
								(curr, shortener) => shortener.visitor.length + curr,
								0,
							)} visits
						</div>
					</div>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
</div>
