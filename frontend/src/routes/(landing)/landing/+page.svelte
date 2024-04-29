<script lang="ts">
	import { Button } from '$lib/components/ui/button'
</script>

<div class="flex flex-col items-center pt-24">
	<div class="flex flex-col gap-24 max-w-6xl">
		<div class="flex flex-col gap-4 items-center text-center">
			<h1
				class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-400">
				Kon.sh
			</h1>
			<p class="max-w-sm text-xl font-semibold text-center">
				Open Source Self-hostable Link Shortener With Analytics
			</p>
			<Button
				href="/signup"
				class="bg-orange-400 hover:bg-orange-300 w-fit">
				Get Started
			</Button>
		</div>
		<div class="flex flex-col gap-4 items-center text-center">
			<h1 class="text-4xl font-bold">Why Kon.sh?</h1>
			<p class="max-w-lg text-xl font-semibold text-center">
				Kon.sh is completely self-hostable, open source, and free. No
				vendor lock-in, can be hosted using docker/docker compose with
				no limitations.
				<a href="/landing/docs" class="text-orange-400 underline">
					Learn More
				</a>
			</p>
		</div>
	</div>
</div>
