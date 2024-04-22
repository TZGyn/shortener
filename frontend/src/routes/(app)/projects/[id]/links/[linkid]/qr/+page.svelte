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
				background={data.project.qr_background}
				color={data.project.qr_foreground} />
		</div>
	</ScrollArea>
{:else}
	<QR
		value={data.shortener_url + '/' + data.shortener.code}
		code={data.shortener.code}
		background={data.project.qr_background}
		color={data.project.qr_foreground} />
{/if}
