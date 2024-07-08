<script lang="ts">
	import type { PageData } from './$types'
	import { page } from '$app/stores'
	import { Button } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'
	import { ScrollArea } from '$lib/components/ui/scroll-area'

	export let data: PageData
</script>

<div class="flex h-fit flex-col gap-2 px-4 pt-8 md:px-10">
	<div class="flex items-center gap-4 pb-4">
		<h2 class="pr-4 text-2xl font-bold tracking-tight md:pr-8">
			{data.project.name}
		</h2>
		<Separator orientation="vertical" />
		{#key $page.url.pathname}
			<ScrollArea orientation="horizontal">
				<div class="flex items-center gap-4">
					<Button
						href={`/projects/${data.project.uuid}`}
						variant={$page.url.pathname ===
						`/projects/${data.project.uuid}`
							? 'secondary'
							: 'ghost'}>
						Shorteners
					</Button>
					<!-- <Button -->
					<!-- 	href={`/projects/${data.project.uuid}/members`} -->
					<!-- 	variant={$page.url.pathname === -->
					<!-- 	`/projects/${data.project.uuid}/members` -->
					<!-- 		? 'secondary' -->
					<!-- 		: 'ghost'}>Members</Button> -->
					<Button
						href={`/projects/${data.project.uuid}/settings`}
						variant={$page.url.pathname ===
						`/projects/${data.project.uuid}/settings`
							? 'secondary'
							: 'ghost'}>
						Settings
					</Button>
				</div>
			</ScrollArea>
		{/key}
	</div>
</div>

<div class="flex w-full flex-grow flex-col overflow-hidden">
	<slot />
</div>
