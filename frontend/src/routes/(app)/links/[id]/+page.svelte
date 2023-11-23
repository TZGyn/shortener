<script lang="ts">
	import type { PageData } from './$types'
	import { Separator } from '$lib/components/ui/separator'
	import * as Card from '$lib/components/ui/card'
	import type { ApexOptions } from 'apexcharts'
	import { mode } from 'mode-watcher'
	import { onMount } from 'svelte'

	export let data: PageData

	let options = {
		series: [
			{
				name: 'Clicks',
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			},
		],
		chart: {
			type: 'bar',
			height: 500,
			toolbar: {
				show: false,
			},
		},
		plotOptions: {
			bar: {
				borderRadius: 4,
				horizontal: false,
			},
		},
		dataLabels: {
			enabled: false,
		},
		xaxis: {
			categories: [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			],
			labels: {
				show: true,
				style: {
					fontSize: '14px',
				},
			},
		},
		yaxis: {
			tickAmount: 1,
			labels: {
				formatter: function (val) {
					return val.toFixed(0)
				},
				style: {
					fontSize: '14px',
				},
			},
		},
		grid: {
			show: false,
		},
		tooltip: {
			theme: 'dark',
		},
	} satisfies ApexOptions

	data.visitor.map((visitor) => {
		options.series[0].data[visitor.month - 1] = visitor.count
	})

	$: options.tooltip.theme = $mode === 'dark' ? 'dark' : 'light'

	let container: HTMLElement | undefined

	const renderChart = async (options: ApexOptions) => {
		if (container) {
			container.innerHTML = ''
		}
		var chart = new apexChart(container, options)
		chart.render()
	}

	$: container && apexChart && renderChart(options)

	let apexChart: typeof ApexCharts
	onMount(async () => {
		apexChart = (await import('apexcharts')).default
	})
</script>

<div class="flex justify-between p-8">
	<div class="text-4xl font-bold">{data.shortener.link}</div>
</div>
<Separator />

<div class="flex flex-col gap-4 overflow-y-scroll p-4">
	<Card.Root class="max-w-[700px]">
		<Card.Header>
			<Card.Title>Clicks</Card.Title>
			<Card.Description
				>Number of visit(s) over this year</Card.Description>
		</Card.Header>
		<Card.Content>
			<div bind:this={container}></div>
		</Card.Content>
	</Card.Root>
</div>
