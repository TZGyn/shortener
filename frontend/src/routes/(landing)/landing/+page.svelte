<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'
	import { Check, XIcon } from 'lucide-svelte'
</script>

<div class="flex flex-col items-center pt-24 w-full">
	<div class="flex flex-col gap-24 p-4 w-full max-w-6xl">
		<div class="flex flex-col gap-10 items-center text-center">
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
		<div class="flex flex-col gap-10 items-center text-center">
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
		<section id="pricing">
			<div
				class="flex flex-col gap-10 items-center pb-64 w-full text-center">
				<h1 class="text-4xl font-bold">Pricing</h1>
				<div
					class="grid w-full grid-cols-[repeat(auto-fit,_minmax(450px,_1fr))] gap-4">
					<div class="flex gap-8 p-8 rounded-lg border">
						<div class="flex flex-col gap-4 w-full text-start">
							<h2 class="text-2xl font-bold">Free (demo)</h2>
							<p>No credit card required.</p>
							<Separator />
							<div class="flex flex-col gap-4">
								<div class="flex gap-2 items-center">
									<Check class="text-orange-400" />
									<p>Unlimited Links</p>
								</div>
								<div class="flex gap-2 items-center">
									<Check class="text-orange-400" />
									<p>Unlimited Projects</p>
								</div>
								<div class="flex gap-2 items-center">
									<XIcon class="text-orange-400" />
									<p>Will be limited in future</p>
								</div>
							</div>
						</div>
						<div
							class="flex flex-col gap-4 justify-center items-center w-full bg-gradient-to-r from-orange-300 to-orange-400 rounded-xl text-start">
							<div class="flex gap-2 items-end">
								<h1 class="text-3xl font-bold">$0</h1>
								<span>/month</span>
							</div>
							<Button href="/signup" class="bg-background">
								Get Started
							</Button>
						</div>
					</div>
					<div class="flex gap-8 p-8 rounded-lg border">
						<div class="flex flex-col gap-4 w-full text-start">
							<h2 class="text-2xl font-bold">Free (Self Host)</h2>
							<p>No credit card required.</p>
							<Separator />
							<div class="flex flex-col gap-4">
								<div class="flex gap-2 items-center">
									<Check class="text-orange-400" />
									<p>Unlimited Links</p>
								</div>
								<div class="flex gap-2 items-center">
									<Check class="text-orange-400" />
									<p>Unlimited Projects</p>
								</div>
								<div class="flex gap-2 items-center">
									<Check class="text-orange-400" />
									<p>Basically No Limits</p>
								</div>
							</div>
						</div>
						<div
							class="flex flex-col gap-4 justify-center items-center w-full bg-gradient-to-r from-orange-300 to-orange-400 rounded-xl text-start">
							<div class="flex gap-2 items-end">
								<h1 class="text-3xl font-bold">$0</h1>
								<span>/month</span>
							</div>
							<Button href="/signup" class="bg-background">
								Get Started
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>
