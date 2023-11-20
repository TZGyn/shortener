<script lang="ts">
	import UserIcon from './UserIcon.svelte'

	import { Separator } from '$lib/components/ui/separator'
	import ThemeToggle from './theme-toggle.svelte'
	import { Button } from '$lib/components/ui/button'
	import { cn } from '$lib/utils'

	export let email: string = ''
	let className: string | undefined = undefined
	export { className as class }
</script>

<div
	class={cn(
		'flex h-full min-w-[350px] flex-col justify-between border-r p-4',
		className,
	)}>
	<div>
		<div class="flex items-center justify-between pb-16">
			<div class="text-xl font-bold">
				<a href="/">Shortener</a>
			</div>
			<ThemeToggle />
		</div>

		<div class="flex flex-col gap-4">
			<Button
				variant="ghost"
				href="/links"
				class="justify-start text-base">Links</Button>
			<Button
				variant="ghost"
				href="/projects"
				class="justify-start text-base ">Projects</Button>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		<Separator />
		<div class="flex items-center justify-between">
			<UserIcon {email} />
		</div>
	</div>
</div>
