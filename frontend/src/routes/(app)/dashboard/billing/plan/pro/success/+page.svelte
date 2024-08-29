<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { CheckCircleIcon } from 'lucide-svelte'
	import * as Dialog from '$lib/components/ui/dialog'

	export let data
</script>

<Dialog.Root open>
	<Dialog.Content>
		<Dialog.Header class="items-center justify-center space-y-4">
			<CheckCircleIcon class="text-success h-16 w-16" />
			<Dialog.Title>Payment Success</Dialog.Title>
			<Dialog.Description>
				You have subscribed to the pro plan, thank you for the
				support.
			</Dialog.Description>
		</Dialog.Header>
		<div class="pt-12">
			<Button href="/dashboard/billing">Return Billing</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
