<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import type { WithElementRef } from 'bits-ui'
	import { cn } from '$lib/utils'

	let {
		ref = $bindable(null),
		value = $bindable(),
		files = $bindable(),
		class: className,
		type,
		...restProps
	}: WithElementRef<
		HTMLInputAttributes & { files?: FileList }
	> = $props()
	const defaultClass =
		'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50'
</script>

{#if type === 'file'}
	<input
		bind:this={ref}
		type="file"
		class={cn(defaultClass, className)}
		bind:value
		bind:files
		{...restProps} />
{:else}
	<input
		bind:this={ref}
		{type}
		class={cn(defaultClass, className)}
		bind:value
		{...restProps} />
{/if}
