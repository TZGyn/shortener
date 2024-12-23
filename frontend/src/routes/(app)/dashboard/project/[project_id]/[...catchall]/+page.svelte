<script>
	import Button from '$lib/components/ui/button/button.svelte'

	let { data } = $props()
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="flex flex-col items-center gap-12">
		<div class="flex flex-col items-center gap-4">
			<div class="text-4xl font-bold">404</div>
			<div class="text-4xl font-bold">Page Not Found</div>
		</div>
		<Button
			href={`/dashboard/project/${data.activeProjectId}`}
			class="w-fit">
			Return Home
		</Button>
	</div>
</div>
