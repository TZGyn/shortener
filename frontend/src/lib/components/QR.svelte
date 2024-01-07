<script>
	import { onMount } from 'svelte'
	import { default as QrCode } from 'qrious'
	import Button from './ui/button/button.svelte'
	import { toast } from 'svelte-sonner'

	const QRcode = new QrCode()

	export let errorCorrection = 'L'
	export let background = '#fff'
	export let color = '#000'
	export let size = '300'
	export let value = ''
	export let padding = 10
	export let className = 'qrcode'

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

	function generateQrCode() {
		QRcode.set({
			background,
			foreground: color,
			level: errorCorrection,
			padding,
			size,
			value,
		})

		image = QRcode.toDataURL()
	}

	export function getImage() {
		return image
	}

	$: {
		if (value) {
			generateQrCode()
		}
	}

	onMount(() => {
		generateQrCode()
	})
</script>

<img src={image} alt={value} class={className} />
<Button on:click={copyImageToClipboard}>Copy Image</Button>
