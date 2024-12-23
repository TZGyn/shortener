<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import type { PageData } from './$types'
	import QR from './(components)/qr.svelte'

	let {
		data,
		shallowRouting,
	}: { data: PageData; shallowRouting: boolean } = $props()

	const url =
		data.project &&
		data.project.enable_custom_domain &&
		data.project.custom_domain
			? data.project.custom_domain
			: data.shortener_url

	const setting = data.project || {
		...data.user,
		qr_background: data.user.qrBackground,
		qr_foreground: data.user.qrForeground,
	}
</script>

{#if !shallowRouting}
	<ScrollArea>
		<div class="max-w-2xl px-10 py-4">
			<QR
				value={'https://' + url + '/' + data.shortener.code}
				code={data.shortener.code}
				background={setting.qr_background}
				color={setting.qr_foreground}
				cornerSquareStyle={setting.qrCornerSquareStyle}
				dotStyle={setting.qrDotStyle}
				existingQrImage={setting.qrImageBase64} />
		</div>
	</ScrollArea>
{:else}
	<QR
		value={'https://' + url + '/' + data.shortener.code}
		code={data.shortener.code}
		background={setting.qr_background}
		color={setting.qr_foreground}
		cornerSquareStyle={setting.qrCornerSquareStyle}
		dotStyle={setting.qrDotStyle}
		existingQrImage={setting.qrImageBase64} />
{/if}
