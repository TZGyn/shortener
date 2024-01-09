<script lang="ts">
	import type { PageData } from './$types'
	import { Separator } from '$lib/components/ui/separator'
	import * as Card from '$lib/components/ui/card'
	import * as Tabs from '$lib/components/ui/tabs'
	import type { ApexOptions } from 'apexcharts'
	import { mode } from 'mode-watcher'
	import { onMount } from 'svelte'
	import {
		ShieldQuestion,
		Smartphone,
		Tablet,
		TabletSmartphone,
	} from 'lucide-svelte'

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
		var chart = new ApexChart(container, options)
		chart.render()
	}

	$: container && ApexChart && renderChart(options)

	let ApexChart: typeof ApexCharts
	onMount(async () => {
		ApexChart = (await import('apexcharts')).default
	})
</script>

<div class="flex h-20 items-center justify-between p-4">
	<div class="text-3xl font-bold">{data.shortener.link}</div>
</div>
<Separator />

<div class="flex flex-wrap gap-4 overflow-y-scroll p-4">
	<Card.Root class="w-[700px]">
		<Card.Header>
			<Card.Title>Clicks</Card.Title>
			<Card.Description
				>Number of visit(s) over this year</Card.Description>
		</Card.Header>
		<Card.Content>
			<div bind:this={container}></div>
		</Card.Content>
	</Card.Root>
	<Card.Root class="min-h-[500px] w-[500px]">
		<Tabs.Root value="country">
			<Card.Header
				class="flex w-full flex-row items-center justify-between space-y-0">
				<div>
					<Card.Title>Visitors</Card.Title>
					<Card.Description
						>Visitors by Country/City</Card.Description>
				</div>
				<Tabs.List>
					<Tabs.Trigger value="country">Country</Tabs.Trigger>
					<Tabs.Trigger value="city">City</Tabs.Trigger>
				</Tabs.List>
			</Card.Header>
			<Card.Content>
				<Tabs.Content value="country">
					{#each data.visitorByCountry as visitorByCountry}
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-4">
								<img
									src={`https://flagsapi.com/${visitorByCountry.code}/flat/64.png`}
									alt="" />
								<div>{visitorByCountry.country}</div>
							</div>
							<div>{visitorByCountry.count}</div>
						</div>
					{/each}
				</Tabs.Content>
				<Tabs.Content value="city">
					{#each data.visitorByCity as visitorByCity}
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-4">
								<img
									src={`https://flagsapi.com/${visitorByCity.code}/flat/64.png`}
									alt="" />
								<div>{visitorByCity.city}</div>
							</div>
							<div>{visitorByCity.count}</div>
						</div>
					{/each}
				</Tabs.Content>
			</Card.Content>
		</Tabs.Root>
	</Card.Root>
	<Card.Root class="min-h-[500px] w-[500px]">
		<Tabs.Root value="vendor">
			<Card.Header
				class="flex w-full flex-row items-center justify-between space-y-0">
				<div>
					<Card.Title>Devices</Card.Title>
					<Card.Description>Devices by Country/City</Card.Description>
				</div>
				<Tabs.List>
					<Tabs.Trigger value="vendor">Vendor</Tabs.Trigger>
					<Tabs.Trigger value="type">Type</Tabs.Trigger>
					<Tabs.Trigger value="os">OS</Tabs.Trigger>
				</Tabs.List>
			</Card.Header>
			<Card.Content>
				<Tabs.Content value="vendor">
					<div class="flex flex-col gap-6">
						{#each data.visitorByDeviceVendor as visitorByDeviceVendor}
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<TabletSmartphone />
									<div>
										{visitorByDeviceVendor.vendor ??
											'Undefined Vendor'}
									</div>
								</div>
								<div>{visitorByDeviceVendor.count}</div>
							</div>
						{/each}
					</div>
				</Tabs.Content>
				<Tabs.Content value="type">
					<div class="flex flex-col gap-6">
						{#each data.visitorByDeviceType as visitorByDeviceType}
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									{#if visitorByDeviceType.type === 'mobile'}
										<Smartphone />
									{:else if visitorByDeviceType.type === 'tablet'}
										<Tablet />
									{:else}
										<TabletSmartphone />
									{/if}
									<div>
										{visitorByDeviceType.type ??
											'Undefined Device Type'}
									</div>
								</div>
								<div>{visitorByDeviceType.count}</div>
							</div>
						{/each}
					</div>
				</Tabs.Content>
				<Tabs.Content value="os">
					<div class="flex flex-col gap-6">
						{#each data.visitorByOS as visitorByOS}
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<TabletSmartphone />
									<div>{visitorByOS.os ?? 'Undefined OS'}</div>
								</div>
								<div>{visitorByOS.count}</div>
							</div>
						{/each}
					</div>
				</Tabs.Content>
			</Card.Content>
		</Tabs.Root>
	</Card.Root>
</div>
