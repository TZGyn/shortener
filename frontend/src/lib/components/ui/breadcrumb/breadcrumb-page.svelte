<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils.js'

	type $$Props = HTMLAnchorAttributes & {
		el?: HTMLSpanElement
	}

	export let el: $$Props['el'] = undefined
	export let className: $$Props['class'] = undefined
	export let href: $$Props['href'] = undefined
	export { className as class }
</script>

<a
	bind:this={el}
	aria-disabled="true"
	aria-current="page"
	{href}
	class={cn(
		'font-normal text-foreground hover:cursor-pointer',
		className,
	)}
	{...$$restProps}>
	<slot />
</a>
