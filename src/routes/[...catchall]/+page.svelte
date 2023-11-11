<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { redirect } from '@sveltejs/kit';

	const returnHome = () => {
		goto('/');
	};
</script>

<div class="w-screen h-screen flex justify-center items-center">
	<div class="flex flex-col gap-12 items-center">
		<div class="flex flex-col gap-4 items-center">
			<div class="text-4xl font-bold">404</div>
			<div class="text-4xl font-bold">Page Not Found</div>
		</div>
		<Button on:click={returnHome} class="w-fit">Return Home</Button>
	</div>
</div>
