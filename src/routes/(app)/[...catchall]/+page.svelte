<script>
	import { goto } from '$app/navigation'
	import Button from '$lib/components/ui/button/button.svelte'
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="flex flex-col items-center gap-12">
		<div class="flex flex-col items-center gap-4">
			<div class="text-4xl font-bold">404</div>
			<div class="text-4xl font-bold">Page Not Found</div>
		</div>
		<Button on:click={() => goto('/')} class="w-fit"
			>Return Home</Button>
	</div>
</div>
