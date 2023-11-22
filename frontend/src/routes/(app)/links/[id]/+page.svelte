<script lang="ts">
	import type { PageData } from './$types'
	import { Separator } from '$lib/components/ui/separator'
	import BarChart from './BarChart.svelte'
	import * as Card from '$lib/components/ui/card'

	export let data: PageData
</script>

<div class="flex justify-between p-8">
	<div class="text-4xl font-bold">{data.shortener.link}</div>
</div>
<Separator />

<div class="flex flex-col gap-4 overflow-y-scroll p-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Clicks</Card.Title>
			<Card.Description
				>Number of visit(s) over this year</Card.Description>
		</Card.Header>
		<Card.Content>
			<BarChart />
		</Card.Content>
	</Card.Root>
</div>
