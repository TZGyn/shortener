<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import type { PageData } from './$types'
	import QR from './(components)/qr.svelte'

	export let data: PageData
	export let shallowRouting = false
</script>

{#if !shallowRouting}
	<ScrollArea>
		<div class="py-4 px-10 max-w-2xl">
			<QR
				value={data.shortener_url + '/' + data.shortener.code}
				code={data.shortener.code}
				background={data.settings?.qr_background || '#fff'}
				color={data.settings?.qr_foreground || '#000'} />
		</div>
	</ScrollArea>
{:else}
	<QR
		value={data.shortener_url + '/' + data.shortener.code}
		code={data.shortener.code}
		background={data.settings?.qr_background || '#fff'}
		color={data.settings?.qr_foreground || '#000'} />
{/if}
