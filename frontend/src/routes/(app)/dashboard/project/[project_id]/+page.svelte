<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import * as Card from '$lib/components/ui/card/index.js'
	import { ChartAreaIcon } from 'lucide-svelte'
	let { data } = $props()
</script>

<div class="p-4">
	<Card.Root class="max-w-[400px]">
		<Card.Header
			class="flex flex-row items-center justify-between space-y-0">
			<div class="border-muted rounded-lg border p-2">
				<ChartAreaIcon />
			</div>
			<Button
				href={`/dashboard/project/${data.activeProjectId}/links`}>
				View Details
			</Button>
		</Card.Header>
		<Card.Content>
			<Card.Title class="text-3xl">{data.visitorCount}</Card.Title>
			<Card.Description>Total Visitor Count</Card.Description>
		</Card.Content>
	</Card.Root>
</div>
