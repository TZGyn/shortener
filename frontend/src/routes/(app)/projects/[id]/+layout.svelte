<script lang="ts">
	import type { PageData } from './$types'
	import { page } from '$app/stores'
	import { Button } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'

	export let data: PageData
</script>

<div class="flex flex-col gap-2 px-10 pt-8 h-fit">
	<div class="flex gap-4 items-center pb-4">
		<h2 class="pr-8 text-2xl font-bold tracking-tight">
			{data.project.name}
		</h2>
		<Separator orientation="vertical" />
		<Button
			href={`/projects/${data.project.uuid}`}
			variant={$page.url.pathname === `/projects/${data.project.uuid}`
				? 'secondary'
				: 'ghost'}>Shorteners</Button>
		<Button
			href={`/projects/${data.project.uuid}/members`}
			variant={$page.url.pathname ===
			`/projects/${data.project.uuid}/members`
				? 'secondary'
				: 'ghost'}>Members</Button>
		<Button
			href={`/projects/${data.project.uuid}/settings`}
			variant={$page.url.pathname ===
			`/projects/${data.project.uuid}/settings`
				? 'secondary'
				: 'ghost'}>Settings</Button>
	</div>
</div>

<div class="flex overflow-hidden flex-col flex-grow w-full">
	<slot />
</div>
