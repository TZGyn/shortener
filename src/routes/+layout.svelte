<script>
	import '../app.postcss';
	import { ModeWatcher } from 'mode-watcher';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
</script>

<ModeWatcher />
<ThemeToggle />
<slot />
