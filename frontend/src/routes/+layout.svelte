<script>
	import { Toaster } from '$lib/components/ui/sonner'
	import '../app.postcss'
	import { ModeWatcher } from 'mode-watcher'
	import { ProgressBar } from '@prgm/sveltekit-progress-bar'
</script>

<svelte:head>
	<title>Link Shortener</title>
</svelte:head>

<ModeWatcher />
<ProgressBar />
<slot />
<Toaster />
