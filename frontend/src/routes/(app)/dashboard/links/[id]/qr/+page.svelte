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
				value={'https://' +
					data.shortener_url +
					'/' +
					data.shortener.code}
				code={data.shortener.code}
				background={data.user.qrBackground}
				color={data.user.qrForeground}
				cornerSquareStyle={data.user.qrCornerSquareStyle}
				dotStyle={data.user.qrDotStyle}
				existingQrImage={data.user.qrImageBase64} />
		</div>
	</ScrollArea>
{:else}
	<QR
		value={'https://' +
			data.shortener_url +
			'/' +
			data.shortener.code}
		code={data.shortener.code}
		background={data.user.qrBackground}
		color={data.user.qrForeground}
		cornerSquareStyle={data.user.qrCornerSquareStyle}
		dotStyle={data.user.qrDotStyle}
		existingQrImage={data.user.qrImageBase64} />
{/if}
