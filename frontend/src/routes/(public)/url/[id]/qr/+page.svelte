<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { toast } from 'svelte-sonner'
	import { Badge } from '$lib/components/ui/badge'
	import { onMount } from 'svelte'
	import * as Card from '$lib/components/ui/card'

	export let data

	let image = ''

	const copyImageToClipboard = async () => {
		if (!image) return

		const imageData = await fetch(image)

		const imageBlob = await imageData.blob()

		try {
			navigator.clipboard.write([
				new ClipboardItem({
					'image/png': imageBlob,
				}),
			])
			toast.success('Copied Image To Clipboard')
		} catch (error) {
			toast.error(
				'Unable to copy item to clipboard. If you are using firefox, you can change the setting dom.events.asyncclipboard.clipboarditem in about:config to true',
			)
		}
	}

	async function generateQrCode() {
		const qrcodestyling = new (
			await import('qr-code-styling')
		).default({
			data: data.url + '/' + data.shortenerId,
			width: 300,
			height: 300,
			margin: 10,
			qrOptions: {
				errorCorrectionLevel: 'L',
				typeNumber: 0,
			},
			backgroundOptions: {
				color: data.colorSetting?.color.background || '#fff',
			},
			dotsOptions: {
				color: data.colorSetting?.color.foreground || '#000',
			},
			cornersSquareOptions: {
				type: 'square',
			},
		})
		const blob = await qrcodestyling.getRawData()
		if (!blob) return
		image = URL.createObjectURL(blob)
	}

	onMount(() => {
		generateQrCode()
	})
</script>

<Card.Root
	class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
	<Card.Header class="flex-col items-center gap-4">
		<Badge variant="secondary" class="w-fit">
			{data.url + '/' + data.shortenerId}
		</Badge>
		<img
			src={image}
			alt={data.url + '/' + data.shortenerId}
			width={300}
			height={300} />
		<Button class="w-full" on:click={copyImageToClipboard}>
			Copy Image
		</Button>
	</Card.Header>
</Card.Root>
