<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte'
</script>

<div class="flex h-screen w-full">
	<Sidebar />
	<div class="w-full p-4">
		<slot />
	</div>
</div>
