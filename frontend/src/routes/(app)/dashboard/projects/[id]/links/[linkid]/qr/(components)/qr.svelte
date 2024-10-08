<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { toast } from 'svelte-sonner'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Badge } from '$lib/components/ui/badge'
	import { browser } from '$app/environment'

	export let background = '#fff'
	export let color = '#000'
	export let value = ''
	export let code = ''
	export let cornerSquareStyle: 'dot' | 'square' | 'extra-rounded' =
		'square'
	export let dotStyle: 'square' | 'rounded' = 'square'
	export let existingQrImage: string | null = null

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
			data: value,
			width: 300,
			height: 300,
			margin: 1,
			qrOptions: {
				errorCorrectionLevel: 'M',
				typeNumber: 0,
			},
			backgroundOptions: {
				color: background,
			},
			dotsOptions: {
				color: color,
				type: dotStyle,
			},
			cornersSquareOptions: {
				type: cornerSquareStyle,
			},
			image: existingQrImage || undefined,
			imageOptions: {
				imageSize: 0.7,
				margin: 8,
			},
		})
		const blob = await qrcodestyling.getRawData()
		if (!blob) return
		image = URL.createObjectURL(blob)
	}

	$: value && browser && generateQrCode()
</script>

<div class="flex h-full flex-col items-center gap-4">
	<Badge variant="secondary">
		{value}
	</Badge>
	<img src={image} alt={value} width={300} height={300} />
	<div class="flex w-full gap-4">
		<Button class="w-full" on:click={copyImageToClipboard}>
			Copy Image
		</Button>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} class="w-full">QR Link</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item href={`/url/${code}/qr`} target="_blank">
					Standard
				</DropdownMenu.Item>
				<DropdownMenu.Item
					href={`/url/${code}/qr?color=true`}
					target="_blank">
					With Style
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
