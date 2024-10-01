<script>
	import { cn } from '$lib/utils'
	import GridPattern from './GridPattern.svelte'
</script>

<div
	class="bg-background absolute right-10 top-10 flex h-full w-full items-center justify-center overflow-hidden rounded-lg p-20 md:shadow-xl">
	<GridPattern
		squares={[
			[4, 4],
			[5, 1],
			[8, 2],
			[6, 6],
			[10, 5],
			[13, 3],
		]}
		class={cn(
			'[mask-image:radial-gradient(200px_circle_at_center,white,transparent)]',
			'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12',
		)}
		fillColor="rgb(156 163 175 / 0.3)" />
</div>
