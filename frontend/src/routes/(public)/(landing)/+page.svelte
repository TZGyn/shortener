<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import {
		Check,
		QrCodeIcon,
		ChartAreaIcon,
		ExternalLinkIcon,
		FileImageIcon,
		StarsIcon,
	} from 'lucide-svelte'

	import BentoGrid from './(components)/BentoGrid.svelte'
	import BentoCard from './(components)/BentoCard.svelte'

	// Features Array
	let features = [
		{
			Icon: QrCodeIcon,
			name: 'QR Code',
			description:
				'Every shortener comes automatically comes with a QR Code',
			href: '/features/qrcode',
			class: 'col-span-3 lg:col-span-1',
		},
		{
			Icon: ChartAreaIcon,
			name: 'Analytics',
			description:
				'Latest data about your shortener to help you analyse',
			href: '/features/analytics',
			class: 'col-span-3 lg:col-span-2',
		},
		{
			Icon: ExternalLinkIcon,
			name: 'Custom Domain',
			description: 'Use your own domain for branding purposes',
			href: '/features/custom-domain',
			class: 'col-span-3 lg:col-span-2',
		},
		{
			Icon: FileImageIcon,
			name: 'File Upload',
			description:
				'Upload files and we will generate a shortener for it',
			href: '/features/file-upload',
			class: 'col-span-3 lg:col-span-1',
		},
	]
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
				<div class="flex items-center justify-center">
					<BentoGrid>
						{#each features as item}
							<BentoCard {...item} />
						{/each}
					</BentoGrid>
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
							<span class="text-4xl font-bold">$5</span>
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
								<StarsIcon class="text-brand" />
								<span class="flex">File Upload (100 GB)</span>
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
								<StarsIcon class="text-brand" />
								<span class="flex">Unlimited Upload</span>
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
