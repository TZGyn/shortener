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
			: 'Kon.sh'}
	</title>
	<meta name="description" content="Link shortener with analytics" />
	<meta property="og:image" content="/logo.png" />
</svelte:head>

<ModeWatcher />
<ProgressBar class="text-orange-400" />
<slot />
<Toaster />
