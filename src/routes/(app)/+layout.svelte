<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte'
</script>

<div class="w-full flex h-screen">
	<Sidebar />
	<div class="w-full p-4">
		<slot />
	</div>
</div>
