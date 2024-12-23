<script lang="ts">
	import {
		QrCodeIcon,
		ChartAreaIcon,
		ExternalLinkIcon,
		FileImageIcon,
	} from 'lucide-svelte'

	import BentoGrid from '../(components)/BentoGrid.svelte'
	import BentoCard from '../(components)/BentoCard.svelte'

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
				class="from-brand-hover to-brand bg-gradient-to-r bg-clip-text text-6xl font-bold leading-normal text-transparent">
				Features
			</h1>
		</div>
		<section id="features" class="pt-12">
			<div
				class="flex w-full flex-col items-center gap-10 text-center">
				<div class="flex items-center justify-center">
					<BentoGrid>
						{#each features as item}
							<BentoCard {...item} />
						{/each}
					</BentoGrid>
				</div>
			</div>
		</section>
	</div>
</main>
