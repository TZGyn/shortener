<script>
	import { Toaster } from '$lib/components/ui/sonner'
	import '../app.postcss'
	import { ModeWatcher } from 'mode-watcher'
	import { ProgressBar } from '@prgm/sveltekit-progress-bar'
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title>{$page.data.page_title || 'Link Shortener'}</title>
	<meta name="description" content="Link shortener with analytics" />
	<meta
		property="og:image"
		content="https://opengraph.githubassets.com/f0a0a319914752781cda8e47b1bba94f9e22847d308c8b974309117abaccfc2f/TZGyn/shortener" />
</svelte:head>

<ModeWatcher />
<ProgressBar />
<slot />
<Toaster />
