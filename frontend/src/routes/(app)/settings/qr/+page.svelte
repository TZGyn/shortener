<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import type { PageData } from './$types'
	import Form from './(components)/form.svelte'

	export let data: PageData
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">QR</h3>
		<p class="text-sm text-muted-foreground">
			Update your QR settings.
		</p>
	</div>
	<Separator />

	<Form data={data.form} />
</div>
