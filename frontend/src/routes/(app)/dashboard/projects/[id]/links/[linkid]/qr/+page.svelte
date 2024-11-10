<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import type { PageData } from './$types'
	import QR from './(components)/qr.svelte'

	let {
		data,
		shallowRouting,
	}: { data: PageData; shallowRouting: boolean } = $props()

	const url =
		data.project.enable_custom_domain && data.project.custom_domain
			? data.project.custom_domain
			: data.shortener_url
</script>

{#if !shallowRouting}
	<ScrollArea>
		<div class="max-w-2xl px-10 py-4">
			<QR
				value={'https://' + url + '/' + data.shortener.code}
				code={data.shortener.code}
				background={data.project.qr_background}
				color={data.project.qr_foreground}
				cornerSquareStyle={data.project.qrCornerSquareStyle}
				dotStyle={data.project.qrDotStyle}
				existingQrImage={data.project.qrImageBase64} />
		</div>
	</ScrollArea>
{:else}
	<QR
		value={'https://' + url + '/' + data.shortener.code}
		code={data.shortener.code}
		background={data.project.qr_background}
		color={data.project.qr_foreground}
		cornerSquareStyle={data.project.qrCornerSquareStyle}
		dotStyle={data.project.qrDotStyle}
		existingQrImage={data.project.qrImageBase64} />
{/if}
