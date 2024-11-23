<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js'
	import * as Card from '$lib/components/ui/card/index.js'

	let {
		host,
		a_record,
		aaaa_record,
		cname_record,
	}: {
		host: string
		cname_record: string
		a_record: string
		aaaa_record: string
	} = $props()

	const defaultValue = cname_record ? 'cname' : 'a'
</script>

<Tabs.Root value={defaultValue}>
	<Tabs.List>
		{#if cname_record}
			<Tabs.Trigger value="cname">CNAME</Tabs.Trigger>
		{/if}
		{#if a_record || aaaa_record}
			<Tabs.Trigger value="a">A and AAAA</Tabs.Trigger>
		{/if}
	</Tabs.List>
	{#if cname_record}
		<Tabs.Content value="cname">
			<Card.Root>
				<Card.Header
					class="grid grid-cols-[80px_1fr_1fr] space-y-0 py-4">
					<Card.Title>Type</Card.Title>
					<Card.Title>Host</Card.Title>
					<Card.Title>Value</Card.Title>
				</Card.Header>
				<Card.Footer
					class="bg-muted grid grid-cols-[80px_1fr_1fr] py-4">
					<Card.Description>CNAME</Card.Description>
					<Card.Description>{host}</Card.Description>
					<Card.Description>{cname_record}</Card.Description>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	{/if}
	{#if a_record || aaaa_record}
		<Tabs.Content value="a">
			<div class="flex flex-col gap-4">
				{#if a_record}
					<Card.Root>
						<Card.Header
							class="grid grid-cols-[80px_1fr_1fr] space-y-0 py-4">
							<Card.Title>Type</Card.Title>
							<Card.Title>Host</Card.Title>
							<Card.Title>Value</Card.Title>
						</Card.Header>
						<Card.Footer
							class="bg-muted grid grid-cols-[80px_1fr_1fr] py-4">
							<Card.Description>A</Card.Description>
							<Card.Description>{host}</Card.Description>
							<Card.Description>{a_record}</Card.Description>
						</Card.Footer>
					</Card.Root>
				{/if}
				{#if aaaa_record}
					<Card.Root>
						<Card.Header
							class="grid grid-cols-[80px_1fr_1fr] space-y-0 py-4">
							<Card.Title>Type</Card.Title>
							<Card.Title>Host</Card.Title>
							<Card.Title>Value</Card.Title>
						</Card.Header>
						<Card.Footer
							class="bg-muted grid grid-cols-[80px_1fr_1fr] py-4">
							<Card.Description>AAAA</Card.Description>
							<Card.Description>{host}</Card.Description>
							<Card.Description>{aaaa_record}</Card.Description>
						</Card.Footer>
					</Card.Root>
				{/if}
			</div>
		</Tabs.Content>
	{/if}
</Tabs.Root>
