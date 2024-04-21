<script lang="ts">
	import type { PageData } from './$types'
	import Form from './(components)/form.svelte'

	export let data: PageData
</script>

<Form data={data.form} />
