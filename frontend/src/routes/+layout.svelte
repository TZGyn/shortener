<script>
	import { Toaster } from '$lib/components/ui/sonner'
	import '../app.postcss'
	import { ModeWatcher } from 'mode-watcher'
	import { ProgressBar } from '@prgm/sveltekit-progress-bar'
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title>
		{$page.data.page_title
			? $page.data.page_title + ' | Kon.sh'
			: 'Kon.sh - URL shortener'}
	</title>
	<meta
		name="description"
		content="Kon.sh URL shortener - free, open source link shortener with analytics, custom qr code and custom name. Bitly/tiny url alternative" />
	<meta property="og:title" content="Kon.sh" />
	<meta
		property="og:description"
		content="Kon.sh URL shortener - free, open source link shortener with analytics, custom qr code and custom name. Bitly/tiny url alternative" />
	<meta property="og:image" content="/og.png" />
	<meta property="og:type" content="website" />
	<meta
		property="og:url"
		content={$page.data.og_url || 'https://app.kon.sh'} />
</svelte:head>

<ModeWatcher />
<ProgressBar class="text-orange-400" />
<slot />
<Toaster />
