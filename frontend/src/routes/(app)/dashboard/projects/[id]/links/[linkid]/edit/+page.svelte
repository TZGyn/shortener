<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import type { PageData } from './$types'
	import Form from './(components)/form.svelte'

	export let data: PageData
	export let shallowRouting = false
</script>

{#if !shallowRouting}
	<ScrollArea>
		<div class="py-4 px-10 max-w-2xl">
			<Form
				data={data.form}
				uuid={data.project.uuid}
				code={data.shortener.code} />
		</div>
	</ScrollArea>
{:else}
	<Form
		data={data.form}
		uuid={data.project.uuid}
		code={data.shortener.code} />
{/if}
