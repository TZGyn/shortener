<script>
	import { Toaster } from '$lib/components/ui/sonner'
	import '../app.postcss'
	import { ModeWatcher } from 'mode-watcher'
</script>

<svelte:head>
	<title>Link Shortener</title>
</svelte:head>

<ModeWatcher />
<slot />
<Toaster />
