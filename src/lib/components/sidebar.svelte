<script>
	import { Separator } from '$lib/components/ui/separator'
	import ThemeToggle from './theme-toggle.svelte'
	import { Button } from '$lib/components/ui/button'
</script>

<div class="w-[400px] p-4 border-r h-full flex flex-col justify-between">
	<div>
		<div class="flex justify-between pb-16 items-center">
			<div class="text-xl font-bold">Shortener</div>
			<ThemeToggle />
		</div>

		<div class="pb-4">Projects</div>
		<Separator />
	</div>
	<div class="flex justify-between items-center">
		<form method="post" action="?/signout">
			<Button variant="destructive" type="submit">Sign Out</Button>
		</form>
	</div>
</div>
