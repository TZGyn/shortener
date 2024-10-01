<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'
	import { ArrowRightIcon } from 'lucide-svelte'
	import { cn } from '$lib/utils'
	import Grid from './Grid.svelte'
	let className: any = ''
	export { className as class }
	export let name
	//   export let background;
	export let Icon // lucide Icon
	export let description
	export let href
</script>

<div
	id={name}
	class={cn(
		'group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl border',
		// light styles
		// 'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
		// dark styles
		// 'transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
		className,
	)}>
	<div>
		<Grid />
		<!-- <svelte:component this={background} /> -->
	</div>
	<div
		class="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
		<svelte:component
			this={Icon}
			class="text-brand h-12 w-12 origin-left transform-gpu transition-all duration-300 ease-in-out group-hover:scale-75" />

		<h3
			class="text-start text-xl font-semibold text-neutral-700 dark:text-neutral-300">
			{name}
		</h3>
		<p class="max-w-lg text-start text-neutral-400">{description}</p>
	</div>

	<div
		class={cn(
			'pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100',
		)}>
		<Button variant="brand" size="sm" class="pointer-events-auto">
			<a {href} class="flex items-center justify-center">
				Learn More
				<ArrowRightIcon class="ml-2 h-4 w-4" />
			</a>
		</Button>
	</div>
	<div
		class="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
</div>
