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
		'flex h-full min-w-[350px] flex-col justify-between border-r',
		className,
	)}>
	<div>
		<div class="flex h-20 items-center justify-between p-4">
			<div class="flex items-center justify-start gap-4">
				<UserIcon {email} />
				{email}
			</div>
			<ThemeToggle />
		</div>
		<Separator />

		<div class="flex flex-col gap-4 p-4">
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
</div>
