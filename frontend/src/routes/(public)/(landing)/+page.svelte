<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import {
		Check,
		QrCodeIcon,
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
				<p class="max-w-4xl text-center text-xl font-semibold">
					Kon.sh only charges for domain & QR customization and longer
					click history.
				</p>
				<div
					class="grid w-full flex-col justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div
						class="relative flex flex-col gap-8 overflow-hidden rounded-2xl border p-4">
						<div class="flex flex-col items-start">
							<h3 class="text-xl font-semibold">Free</h3>
							<p class="text-muted-foreground text-sm">
								Essentials only. No credit card needed.
							</p>
						</div>
						<div class="flex flex-row items-end gap-2">
							<span class="text-4xl font-bold">$0</span>
							<span>/ month</span>
						</div>
						<Button
							href="/signup"
							class="bg-brand hover:bg-brand-hover">
							Get Started
						</Button>

						<ul class="flex flex-col gap-4 font-normal">
							<li class="flex items-center gap-3">
								<Check class="text-brand" />
								<span class="flex">Unlimited Links</span>
							</li>
							<li class="flex items-center gap-3">
								<Check class="text-brand" />
								<span class="flex">Unlimited Projects</span>
							</li>
							<li class="flex items-center gap-3">
								<Check class="text-brand" />
								<span class="flex">Click history up to 1 month</span>
							</li>
						</ul>
					</div>
					<div
						class="border-brand relative flex flex-col gap-8 overflow-hidden rounded-2xl border-2 p-4">
						<div class="flex flex-col items-start">
							<h3 class="text-xl font-semibold">Pro</h3>
							<p class="text-muted-foreground text-sm">
								More customizations.
							</p>
						</div>
						<div class="flex flex-row items-end gap-2">
							<span class="text-4xl font-bold">$9</span>
							<span>/ month</span>
						</div>
						<Button
							href={`/signup?redirect=${encodeURIComponent(
								'/dashboard/billing',
							)}`}
							class="bg-brand hover:bg-brand-hover">
							Get Started
						</Button>

						<ul class="flex flex-col gap-4 font-normal">
							<li class="flex items-center gap-3">
								<Check class="text-brand" />
								<span class="flex">Everything in free</span>
							</li>
							<li class="flex items-center gap-3">
								<Check class="text-brand" />
								<span class="flex">5 custom domains</span>
							</li>
							<li class="flex items-center gap-3">
								<Check class="text-brand" />
								<span class="flex">2 years click history</span>
							</li>
							<li class="flex items-center gap-3">
								<Check class="text-brand" />
								<span class="flex">Custom QR Code</span>
							</li>
						</ul>
					</div>
					<div
						class="relative flex flex-col gap-8 overflow-hidden rounded-2xl border p-4">
						<div class="flex flex-col items-start">
							<h3 class="text-xl font-semibold">Free (Self Host)</h3>
							<p class="text-muted-foreground text-sm">
								You host on your server.
							</p>
						</div>
						<div class="flex flex-row items-end gap-2">
							<span class="text-4xl font-bold">$0</span>
							<span>/ month</span>
						</div>
						<Button
							href="/signup"
							class="bg-brand hover:bg-brand-hover">
							Get Started
						</Button>

						<ul class="flex flex-col gap-4 font-normal">
							<li class="flex items-center gap-3">
								<Check class="text-brand" />
								<span class="flex">Unlimited Links</span>
							</li>
							<li class="flex items-center gap-3">
								<Check class="text-brand" />
								<span class="flex">Unlimited Projects</span>
							</li>
							<li class="flex items-center gap-3">
								<Check class="text-brand" />
								<span class="flex">Basically No Limits</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	</div>
</main>
