<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<div class="flex h-screen w-full">
	<Sidebar email={data.user.email} />
	<div class="w-full p-4">
		<slot />
	</div>
</div>
