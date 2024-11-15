<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { toast } from 'svelte-sonner'
	import { Badge } from '$lib/components/ui/badge'
	import { onMount } from 'svelte'
	import * as Card from '$lib/components/ui/card'

	let { data } = $props()

	let image = $state('')

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
			data: 'https://' + data.url + '/' + data.shortenerId,
			width: 300,
			height: 300,
			margin: 1,
			qrOptions: {
				errorCorrectionLevel: 'M',
				typeNumber: 0,
			},
			backgroundOptions: {
				color: data.setting?.color.background || '#fff',
			},
			dotsOptions: {
				color: data.setting?.color.foreground || '#000',
				type: data.setting?.dotStyle || 'square',
			},
			cornersSquareOptions: {
				type: data.setting?.cornerSquareType || 'square',
			},
			image: data.setting?.image || undefined,
			imageOptions: {
				imageSize: 0.7,
				margin: 8,
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
	<Card.Content class="flex flex-col items-center gap-4">
		<Badge variant="secondary" class="w-fit">
			{data.url + '/' + data.shortenerId}
		</Badge>
		<img
			src={image}
			alt={data.url + '/' + data.shortenerId}
			width={300}
			height={300} />
		<Button class="w-full" onclick={copyImageToClipboard}>
			Copy Image
		</Button>
	</Card.Content>
</Card.Root>
