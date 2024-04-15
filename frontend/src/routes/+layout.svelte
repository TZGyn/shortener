<script>
	import { Toaster } from '$lib/components/ui/sonner'
	import '../app.postcss'
	import { ModeWatcher } from 'mode-watcher'
	import { ProgressBar } from '@prgm/sveltekit-progress-bar'
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title>{$page.data.page_title || 'Link Shortener'}</title>
</svelte:head>

<ModeWatcher />
<ProgressBar />
<slot />
<Toaster />
