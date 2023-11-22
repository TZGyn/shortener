<script lang="ts">
	import type { ApexOptions } from 'apexcharts'
	import { mode } from 'mode-watcher'
	import { onMount } from 'svelte'
	let options = {
		series: [
			{
				name: 'Clicks',
				data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
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
				show: false,
			},
		},
		tooltip: {
			theme: 'dark',
		},
	} satisfies ApexOptions

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

<div bind:this={container}></div>
