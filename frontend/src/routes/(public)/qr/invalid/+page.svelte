<script>
	import { goto } from '$app/navigation'
	import Button from '$lib/components/ui/button/button.svelte'
</script>

<div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
	<div class="flex flex-col items-center gap-12">
		<div class="flex flex-col items-center gap-4">
			<div class="text-4xl font-bold">404</div>
			<div class="text-4xl font-bold">Invalid Url</div>
		</div>
		<Button on:click={() => goto('/')} class="w-fit">Return</Button>
	</div>
</div>
