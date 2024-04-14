<script lang="ts">
	import type { PageData } from './$types'
	import { page } from '$app/stores'
	import { Button } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'

	export let data: PageData
</script>

<div class="flex flex-col gap-4 px-10 pt-8 h-fit">
	<h2 class="text-2xl font-bold tracking-tight">
		{data.project.name}
	</h2>
	<div class="flex gap-4">
		<Button
			href={`/projects/${data.project.uuid}`}
			variant={$page.url.pathname === `/projects/${data.project.uuid}`
				? 'secondary'
				: 'ghost'}>Shorteners</Button>
		<Button
			href={`/projects/${data.project.uuid}/settings`}
			variant={$page.url.pathname ===
			`/projects/${data.project.uuid}/settings`
				? 'secondary'
				: 'ghost'}>Settings</Button>
	</div>
	<Separator />
</div>

<div class="flex overflow-hidden flex-col flex-grow w-full">
	<slot />
</div>
