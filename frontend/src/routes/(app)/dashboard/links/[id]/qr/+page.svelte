<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import type { PageData } from './$types'
	import QR from './(components)/qr.svelte'

	export let data: PageData
	export let shallowRouting = false
</script>

{#if !shallowRouting}
	<ScrollArea>
		<div class="max-w-2xl px-10 py-4">
			<QR
				value={data.shortener_url + '/' + data.shortener.code}
				code={data.shortener.code}
				background={data.settings?.qr_background || '#fff'}
				color={data.settings?.qr_foreground || '#000'}
				cornerSquareStyle={data.user.qrCornerSquareStyle}
				dotStyle={data.user.qrDotStyle} />
		</div>
	</ScrollArea>
{:else}
	<QR
		value={data.shortener_url + '/' + data.shortener.code}
		code={data.shortener.code}
		background={data.settings?.qr_background || '#fff'}
		color={data.settings?.qr_foreground || '#000'}
		cornerSquareStyle={data.user.qrCornerSquareStyle}
		dotStyle={data.user.qrDotStyle} />
{/if}
