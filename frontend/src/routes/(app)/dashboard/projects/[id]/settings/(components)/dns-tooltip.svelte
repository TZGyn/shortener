<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js'
	import { InfoIcon } from 'lucide-svelte'

	let {
		a_record,
		aaaa_record,
		cname_record,
		custom_ip,
		domain,
	}: {
		domain: string
		custom_ip: string | null
		cname_record: string
		a_record: string
		aaaa_record: string
	} = $props()
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger class="flex items-center gap-1">
			<InfoIcon class="h-4 w-4" />
			{#if custom_ip}
				{custom_ip}
			{:else if cname_record}
				{cname_record}
			{:else if a_record}
				{a_record}
			{:else if aaaa_record}
				{aaaa_record}
			{:else}
				{'Public IP not found'}
			{/if}
		</Tooltip.Trigger>
		<Tooltip.Content>
			{#if custom_ip}
				<div>
					{'Create a CNAME/ALIAS record for ' +
						domain +
						' to ' +
						custom_ip}
				</div>
			{/if}
			{#if cname_record}
				<div>
					{'Create a CNAME/ALIAS record for ' +
						domain +
						' to ' +
						cname_record}
				</div>
			{/if}
			{#if a_record}
				<div>
					{'Create a A record for ' + domain + ' to ' + a_record}
				</div>
			{/if}

			{#if aaaa_record}
				<div>
					{'Create a AAAA record for ' +
						domain +
						' to ' +
						aaaa_record}
				</div>
			{/if}
			{#if !(custom_ip || cname_record || a_record || aaaa_record)}
				<div>
					{'Public IP not found'}
				</div>
			{/if}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
