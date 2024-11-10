<script lang="ts">
	import { CheckCircle2Icon, XCircleIcon } from 'lucide-svelte'
	import { Button } from '$lib/components/ui/button'
	let { data } = $props()
</script>

<div
	class="flex h-screen w-screen flex-col items-center justify-center gap-4">
	{#if data.verified}
		<CheckCircle2Icon class="text-success" size="64" />
		<h1 class="text-3xl font-bold">Email Verification Successful</h1>
		<div class="text-center">
			<Button href="/settings/account">Return Home</Button>
		</div>
	{:else}
		<XCircleIcon class="text-destructive" size="64" />
		<h1 class="text-3xl font-bold">Email Verification Failed</h1>
		<div class="text-center">
			<Button href="/settings/account">Try Again</Button>
		</div>
	{/if}
</div>
