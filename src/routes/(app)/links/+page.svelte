<script lang="ts">
	import type { PageData } from './$types'
	import { Separator } from '$lib/components/ui/separator'

	export let data: PageData
	console.log('data', data)
</script>

<div class="p-8 text-4xl font-bold">Links</div>
<Separator />

{#if data.shorteners.length > 0}
	{#each data.shorteners as shortener}
		{JSON.stringify(shortener)}
	{/each}
{:else}
	<div>No Data</div>
{/if}
