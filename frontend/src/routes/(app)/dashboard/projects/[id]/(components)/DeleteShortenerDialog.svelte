<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { Loader2 } from 'lucide-svelte'
	import { invalidateAll } from '$app/navigation'
	import { toast } from 'svelte-sonner'

	export let deleteDialogOpen = false
	export let deleteShortenerCode = ''
	let isDeleteLoading = false

	const deleteShortener = async () => {
		isDeleteLoading = true
		await fetch(`/api/shortener/${deleteShortenerCode}`, {
			method: 'delete',
		})
		isDeleteLoading = false
		toast.success('Shortener deleted successfully')
		deleteDialogOpen = false
		await invalidateAll()
	}
</script>

<AlertDialog.Root bind:open={deleteDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				You are about to delete a shortener.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={isDeleteLoading}
				>Cancel</AlertDialog.Cancel>
			<Button
				variant="destructive"
				on:click={deleteShortener}
				class="flex gap-2"
				disabled={isDeleteLoading}>
				{#if isDeleteLoading}
					<Loader2 class="animate-spin" />
				{/if}
				Delete
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
