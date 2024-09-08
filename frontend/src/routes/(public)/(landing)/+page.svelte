<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'
	import {
		Check,
		QrCodeIcon,
		XIcon,
		ChartAreaIcon,
		ExternalLinkIcon,
	} from 'lucide-svelte'
</script>

<main class="flex w-full flex-col items-center pt-24">
	<div class="flex w-full max-w-6xl flex-col gap-12 p-4">
		<div class="flex flex-col items-center gap-10 text-center">
			<h1
				class="from-brand-hover to-brand bg-gradient-to-r bg-clip-text text-6xl font-bold text-transparent">
				Kon.sh
			</h1>
			<h2 class="max-w-sm text-center text-xl font-semibold">
				Free, Open Source URL Shortener with Analytics and Custom QR
				Code
			</h2>
			<Button
				href="/signup"
				class="bg-brand hover:bg-brand-hover w-fit">
				Get Started
			</Button>
		</div>
		<div class="flex flex-col items-center gap-10 pt-12 text-center">
			<h2 class="text-4xl font-bold">Why Kon.sh?</h2>
			<p class="max-w-lg text-center text-xl font-semibold">
				Kon.sh is completely self-hostable, open source, and free. No
				vendor lock-in, can be hosted using docker/docker compose with
				no limitations.
				<!-- <a href="/docs" class="text-orange-400 underline">
					Learn More
				</a> -->
			</p>
		</div>
		<section id="features" class="pt-12">
			<div
				class="flex w-full flex-col items-center gap-10 text-center">
				<h2 class="text-4xl font-bold">Features</h2>
				<div
					class="grid w-full grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-4">
					<div class="flex gap-8 rounded-lg p-8">
						<div class="flex w-full flex-col gap-4 text-start">
							<div class="flex flex-col items-center justify-center">
								<QrCodeIcon size={128} class="text-brand" />
								<h3 class="text-xl font-semibold">Custom QR Codes</h3>
							</div>
						</div>
					</div>
					<div class="flex gap-8 rounded-lg p-8">
						<div class="flex w-full flex-col gap-4 text-start">
							<div class="flex flex-col items-center justify-center">
								<ChartAreaIcon size={128} class="text-brand" />
								<h3 class="text-xl font-semibold">Analytics</h3>
							</div>
						</div>
					</div>
					<div class="flex gap-8 rounded-lg p-8">
						<div class="flex w-full flex-col gap-4 text-start">
							<div class="flex flex-col items-center justify-center">
								<ExternalLinkIcon size={128} class="text-brand" />
								<h3 class="text-xl font-semibold">Custom Domains</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section id="pricing" class="pt-12">
			<div
				class="flex w-full flex-col items-center gap-10 text-center">
				<h2 class="text-4xl font-bold">Pricing</h2>
				<div
					class="grid w-full grid-cols-[repeat(auto-fit,_minmax(450px,_1fr))] gap-4">
					<div class="flex gap-8 rounded-lg border p-8">
						<div class="flex w-full flex-col gap-4 text-start">
							<h3 class="text-2xl font-bold">Free</h3>
							<p class="text-muted-foreground">
								No credit card required.
							</p>
							<Separator />
							<div class="flex flex-col gap-4">
								<div class="flex items-center gap-2">
									<Check class="text-brand" />
									<p>Unlimited Links</p>
								</div>
								<div class="flex items-center gap-2">
									<Check class="text-brand" />
									<p>Unlimited Projects</p>
								</div>
								<div class="flex items-center gap-2">
									<Check class="text-brand" />
									<p>Click history up to 1 month</p>
								</div>
							</div>
						</div>
						<div
							class="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-r from-orange-300 to-orange-400 text-start">
							<div class="flex items-end gap-2">
								<p class="text-3xl font-bold">$0</p>
								<span>/month</span>
							</div>
							<Button href="/signup" class="bg-background">
								Get Started
							</Button>
						</div>
					</div>
					<div class="flex gap-8 rounded-lg border p-8">
						<div class="flex w-full flex-col gap-4 text-start">
							<h3 class="text-2xl font-bold">Pro</h3>
							<p class="text-muted-foreground">
								More customizations.
							</p>
							<Separator />
							<div class="flex flex-col gap-4">
								<div class="flex items-center gap-2">
									<Check class="text-brand" />
									<p>Everything in free</p>
								</div>
								<div class="flex items-center gap-2">
									<Check class="text-brand" />
									<p>5 custom domains</p>
									<!-- <Tooltip.Root>
								<Tooltip.Trigger class="flex items-center gap-1">
									<InfoIcon class="h-4 w-4" />
								</Tooltip.Trigger>
								<Tooltip.Content>
									Additional domains are $3 per domain
								</Tooltip.Content>
							</Tooltip.Root> -->
								</div>
								<div class="flex items-center gap-2">
									<Check class="text-brand" />
									<p>2 years click history</p>
								</div>
								<div class="flex items-center gap-2">
									<Check class="text-brand" />
									<p>Custom QR Code</p>
								</div>
							</div>
						</div>
						<div
							class="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-r from-orange-300 to-orange-400 text-start">
							<div class="flex items-end gap-2">
								<p class="text-3xl font-bold">$9</p>
								<span>/month</span>
							</div>
							<Button
								href={`/signup?redirect=${encodeURIComponent(
									'/dashboard/billing',
								)}`}
								class="bg-background">
								Get Started
							</Button>
						</div>
					</div>
					<div class="flex gap-8 rounded-lg border p-8">
						<div class="flex w-full flex-col gap-4 text-start">
							<h3 class="text-2xl font-bold">Free (Self Host)</h3>
							<p>No credit card required.</p>
							<Separator />
							<div class="flex flex-col gap-4">
								<div class="flex items-center gap-2">
									<Check class="text-brand" />
									<p>Unlimited Links</p>
								</div>
								<div class="flex items-center gap-2">
									<Check class="text-brand" />
									<p>Unlimited Projects</p>
								</div>
								<div class="flex items-center gap-2">
									<Check class="text-brand" />
									<p>Basically No Limits</p>
								</div>
							</div>
						</div>
						<div
							class="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-r from-orange-300 to-orange-400 text-start">
							<div class="flex items-end gap-2">
								<p class="text-3xl font-bold">$0</p>
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
</main>
