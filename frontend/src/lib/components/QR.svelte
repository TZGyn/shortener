<script>
	import { onMount } from 'svelte'
	import { default as QrCode } from 'qrious'
	import Button from './ui/button/button.svelte'

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
		console.log(image)

		const imageData = await fetch(image)

		const imageBlob = await imageData.blob()

		try {
			navigator.clipboard.write([
				new ClipboardItem({
					'image/png': imageBlob,
				}),
			])
		} catch (error) {
			console.error(error)
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
<Button on:click={copyImageToClipboard}>Copy To Clipboard</Button>
