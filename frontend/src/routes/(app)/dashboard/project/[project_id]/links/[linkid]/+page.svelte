<script lang="ts">
	import * as Table from '$lib/components/ui/table'
	import * as Card from '$lib/components/ui/card'
	import * as Tabs from '$lib/components/ui/tabs'
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import type { ApexOptions } from 'apexcharts'
	import { mode } from 'mode-watcher'
	import { onMount } from 'svelte'
	import {
		Smartphone,
		Tablet,
		TabletSmartphone,
		GlobeIcon,
	} from 'lucide-svelte'
	import { Progress } from '$lib/components/ui/progress'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import * as Avatar from '$lib/components/ui/avatar'

	let { data } = $props()

	let options: ApexOptions = $state({
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
	})

	let container: HTMLElement | undefined = $state()

	const renderChart = async (options: ApexOptions) => {
		if (container) {
			container.innerHTML = ''
		}
		var chart = new ApexChart(container, options)
		chart.render()
	}

	let ApexChart: typeof ApexCharts
	onMount(async () => {
		data.visitor.map((visitor) => {
			if (options.series) {
				options.series[0].data[visitor.month - 1] = visitor.count
			}
		})

		if (options && options.tooltip) {
			options.tooltip.theme = $mode === 'dark' ? 'dark' : 'light'
		}
		ApexChart = (await import('apexcharts')).default
		renderChart(options)
	})
</script>

<ScrollArea>
	<div class="flex p-4">
		<Card.Root class="w-[400px]">
			<Card.Header>
				<Card.Title>Total Visitors</Card.Title>
				<Card.Description>
					Number of visit(s) all time
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<span class="text-2xl font-bold">
					{data.visitorAllTime[0].count}
				</span>
			</Card.Content>
		</Card.Root>
	</div>

	<div
		class="flex flex-col gap-4 gap-y-8 p-4 2xl:grid 2xl:grid-cols-[repeat(auto-fit,_minmax(600px,_1fr))]">
		<Card.Root>
			<Card.Header>
				<Card.Title>Clicks</Card.Title>
				<Card.Description>
					Number of visit(s) over this year
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<div bind:this={container}></div>
			</Card.Content>
		</Card.Root>

		<Tabs.Root value="country">
			<Tabs.List>
				<Tabs.Trigger value="country">Country</Tabs.Trigger>
				<Tabs.Trigger value="city">City</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="country">
				<Card.Root class="h-full min-h-[600px]">
					<Card.Header
						class="flex w-full flex-row items-center justify-between border-b p-4">
						<Card.Description>Name</Card.Description>
						<Card.Description>Count</Card.Description>
					</Card.Header>
					<Card.Content class="p-0">
						{#await data.visitorByCountry}
							<Skeleton class="h-32 w-full rounded-none" />
						{:then visitorByCountries}
							{#each visitorByCountries as visitorByCountry}
								<div
									class="hover:bg-muted flex flex-col gap-2 border-b p-2 px-4 transition-colors">
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-4">
											<img
												src={`https://flagsapi.com/${visitorByCountry.code}/flat/32.png`}
												alt="" />
											<div>{visitorByCountry.country}</div>
										</div>
										<div>
											{visitorByCountry.count}
											<span class="text-muted-foreground">
												({(
													(visitorByCountry.count /
														data.visitorAllTime[0].count) *
													100
												).toDecimalPoint(2)} %)
											</span>
										</div>
									</div>
									<Progress
										value={visitorByCountry.count}
										max={data.visitorAllTime[0].count}
										class={'h-2'} />
								</div>
							{/each}
						{/await}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="city">
				<Card.Root class="h-full min-h-[600px]">
					<Card.Header
						class="flex w-full flex-row items-center justify-between border-b p-4">
						<Card.Description>Name</Card.Description>
						<Card.Description>Count</Card.Description>
					</Card.Header>
					<Card.Content class="p-0">
						{#await data.visitorByCity}
							<Skeleton class="h-32 w-full rounded-none" />
						{:then visitorByCities}
							{#each visitorByCities as visitorByCity}
								<div
									class="hover:bg-muted flex flex-col gap-2 border-b p-2 px-4 transition-colors">
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-4">
											<img
												src={`https://flagsapi.com/${visitorByCity.code}/flat/32.png`}
												alt="" />
											<div>{visitorByCity.city}</div>
										</div>
										<div>
											{visitorByCity.count}
											<span class="text-muted-foreground">
												({(
													(visitorByCity.count /
														data.visitorAllTime[0].count) *
													100
												).toDecimalPoint(2)} %)
											</span>
										</div>
									</div>
									<Progress
										value={visitorByCity.count}
										max={data.visitorAllTime[0].count}
										class={'h-2'} />
								</div>
							{/each}
						{/await}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>

		<Tabs.Root value="vendor">
			<Tabs.List>
				<Tabs.Trigger value="vendor">Vendor</Tabs.Trigger>
				<Tabs.Trigger value="type">Type</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="vendor">
				<Card.Root class="h-full min-h-[600px]">
					<Card.Header
						class="flex w-full flex-row items-center justify-between border-b p-4">
						<Card.Description>Name</Card.Description>
						<Card.Description>Count</Card.Description>
					</Card.Header>
					<Card.Content class="p-0">
						{#await data.visitorByDeviceVendor}
							<Skeleton class="h-32 w-full rounded-none" />
						{:then visitorByDeviceVendors}
							{#each visitorByDeviceVendors as visitorByDeviceVendor}
								<div
									class="hover:bg-muted flex flex-col gap-2 border-b p-2 px-4 transition-colors">
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-4">
											<TabletSmartphone />
											<div>
												{visitorByDeviceVendor.vendor || '(None)'}
											</div>
										</div>
										<div>
											{visitorByDeviceVendor.count}
											<span class="text-muted-foreground">
												({(
													(visitorByDeviceVendor.count /
														data.visitorAllTime[0].count) *
													100
												).toDecimalPoint(2)} %)
											</span>
										</div>
									</div>
									<Progress
										value={visitorByDeviceVendor.count}
										max={data.visitorAllTime[0].count}
										class={'h-2'} />
								</div>
							{/each}
						{/await}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="type">
				<Card.Root class="h-full min-h-[600px]">
					<Card.Header
						class="flex w-full flex-row items-center justify-between border-b p-4">
						<Card.Description>Name</Card.Description>
						<Card.Description>Count</Card.Description>
					</Card.Header>
					<Card.Content class="p-0">
						{#await data.visitorByDeviceType}
							<Skeleton class="h-32 w-full rounded-none" />
						{:then visitorByDeviceTypes}
							{#each visitorByDeviceTypes as visitorByDeviceType}
								<div
									class="hover:bg-muted flex flex-col gap-2 border-b p-2 px-4 transition-colors">
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
												{visitorByDeviceType.type ?? '(None)'}
											</div>
										</div>
										<div>
											{visitorByDeviceType.count}
											<span class="text-muted-foreground">
												({(
													(visitorByDeviceType.count /
														data.visitorAllTime[0].count) *
													100
												).toDecimalPoint(2)} %)
											</span>
										</div>
									</div>
									<Progress
										value={visitorByDeviceType.count}
										max={data.visitorAllTime[0].count}
										class={'h-2'} />
								</div>
							{/each}
						{/await}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>

		<Tabs.Root value="browser">
			<Tabs.List>
				<Tabs.Trigger value="browser">Browser</Tabs.Trigger>
				<Tabs.Trigger value="os">OS</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="browser">
				<Card.Root class="h-full min-h-[600px]">
					<Card.Header
						class="flex w-full flex-row items-center justify-between border-b p-4">
						<Card.Description>Name</Card.Description>
						<Card.Description>Count</Card.Description>
					</Card.Header>
					<Card.Content class="p-0">
						{#await data.visitorByBrowser}
							<Skeleton class="h-32 w-full rounded-none" />
						{:then visitorByBrowsers}
							{#each visitorByBrowsers as visitorByBrowser}
								<div
									class="hover:bg-muted flex flex-col gap-2 border-b p-2 px-4 transition-colors">
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-4">
											<GlobeIcon />
											<div>
												{visitorByBrowser.browser || '(None)'}
											</div>
										</div>
										<div>
											{visitorByBrowser.count}
											<span class="text-muted-foreground">
												({(
													(visitorByBrowser.count /
														data.visitorAllTime[0].count) *
													100
												).toDecimalPoint(2)} %)
											</span>
										</div>
									</div>
									<Progress
										value={visitorByBrowser.count}
										max={data.visitorAllTime[0].count}
										class={'h-2'} />
								</div>
							{/each}
						{/await}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="os">
				<Card.Root class="h-full min-h-[600px]">
					<Card.Header
						class="flex w-full flex-row items-center justify-between border-b p-4">
						<Card.Description>Name</Card.Description>
						<Card.Description>Count</Card.Description>
					</Card.Header>
					<Card.Content class="p-0">
						{#await data.visitorByOS}
							<Skeleton class="h-32 w-full rounded-none" />
						{:then visitorByOSs}
							{#each visitorByOSs as visitorByOS}
								<div
									class="hover:bg-muted flex flex-col gap-2 border-b p-2 px-4 transition-colors">
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-4">
											<TabletSmartphone />
											<div>{visitorByOS.os || '(None)'}</div>
										</div>
										<div>
											{visitorByOS.count}
											<span class="text-muted-foreground">
												({(
													(visitorByOS.count /
														data.visitorAllTime[0].count) *
													100
												).toDecimalPoint(2)} %)
											</span>
										</div>
									</div>
									<Progress
										value={visitorByOS.count}
										max={data.visitorAllTime[0].count}
										class={'h-2'} />
								</div>
							{/each}
						{/await}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>

		<Tabs.Root value="referer">
			<Tabs.List>
				<Tabs.Trigger value="referer">Referer</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="referer">
				<Card.Root class="h-full min-h-[600px]">
					<Card.Header
						class="flex w-full flex-row items-center justify-between border-b p-4">
						<Card.Description>Name</Card.Description>
						<Card.Description>Count</Card.Description>
					</Card.Header>
					<Card.Content class="p-0">
						{#await data.visitorByReferer}
							<Skeleton class="h-32 w-full rounded-none" />
						{:then visitorByReferers}
							{#each visitorByReferers as visitorByReferer}
								<div
									class="hover:bg-muted flex flex-col gap-2 border-b p-2 px-4 transition-colors">
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-4">
											<Avatar.Root class="h-6 w-6">
												<Avatar.Image
													src={`https://unavatar.io/${visitorByReferer.referer}`}
													alt="icon" />
												<Avatar.Fallback>
													<GlobeIcon />
												</Avatar.Fallback>
											</Avatar.Root>
											<div>
												{visitorByReferer.referer || '(direct)'}
											</div>
										</div>
										<div>
											{visitorByReferer.count}
											<span class="text-muted-foreground">
												({(
													(visitorByReferer.count /
														data.visitorAllTime[0].count) *
													100
												).toDecimalPoint(2)} %)
											</span>
										</div>
									</div>
									<Progress
										value={visitorByReferer.count}
										max={data.visitorAllTime[0].count}
										class={'h-2'} />
								</div>
							{/each}
						{/await}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
		<Card.Root class="col-span-2 h-full min-h-[600px]">
			<Card.Header class="border-b pb-4">
				<Card.Title>Last 10 Visits</Card.Title>
			</Card.Header>
			<Card.Content class="p-0">
				{#await data.last10Visitors}
					<Skeleton class="h-32 w-full rounded-none" />
				{:then last10Visitors}
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Country</Table.Head>
								<Table.Head>City</Table.Head>
								<Table.Head>Device</Table.Head>
								<Table.Head>Browser</Table.Head>
								<Table.Head>Referrer</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each last10Visitors as visitor}
								<Table.Row>
									<Table.Cell>
										<div class="flex items-center gap-2">
											<img
												src={`https://flagsapi.com/${visitor.countryCode}/flat/32.png`}
												alt="" />
											<p>{visitor.country}</p>
										</div>
									</Table.Cell>
									<Table.Cell>{visitor.city}</Table.Cell>
									<Table.Cell>{visitor.deviceType}</Table.Cell>
									<Table.Cell>{visitor.browser}</Table.Cell>
									<Table.Cell>{visitor.referer}</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{/await}
			</Card.Content>
		</Card.Root>
	</div>
</ScrollArea>
