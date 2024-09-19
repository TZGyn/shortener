<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import type { PageData } from './$types'
	import Form from './(components)/form.svelte'

	export let data: PageData
	export let shallowRouting = false
</script>

{#if !shallowRouting}
	<ScrollArea>
		<div class="max-w-2xl px-10 py-4">
			<Form data={data.form} code={data.shortener.id} />
		</div>
	</ScrollArea>
{:else}
	<Form data={data.form} code={data.shortener.id} />
{/if}
