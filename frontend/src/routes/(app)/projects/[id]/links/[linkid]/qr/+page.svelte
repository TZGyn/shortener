<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import type { PageData } from './$types'
	import QR from './(components)/qr.svelte'

	export let data: PageData
	export let shallowRouting = false

	const url =
		data.project.enable_custom_domain && data.project.custom_domain
			? data.project.custom_domain
			: data.shortener_url
</script>

{#if !shallowRouting}
	<ScrollArea>
		<div class="max-w-2xl px-10 py-4">
			<QR
				value={url + '/' + data.shortener.code}
				code={data.shortener.code}
				background={data.project.qr_background}
				color={data.project.qr_foreground} />
		</div>
	</ScrollArea>
{:else}
	<QR
		value={url + '/' + data.shortener.code}
		code={data.shortener.code}
		background={data.project.qr_background}
		color={data.project.qr_foreground} />
{/if}
