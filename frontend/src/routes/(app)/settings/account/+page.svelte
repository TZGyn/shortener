<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import type { PageData } from './$types'
	import Form from './(components)/form.svelte'

	export let data: PageData
</script>

<div class="flex flex-col gap-6 h-auto">
	<div>
		<h3 class="text-lg font-medium">Account</h3>
		<p class="text-sm text-muted-foreground">
			Update your account settings.
		</p>
	</div>
	<Separator />

	<Form data={data.form} />
</div>
