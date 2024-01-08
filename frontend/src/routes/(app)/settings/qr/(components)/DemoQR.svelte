<script>
	import { onMount } from 'svelte'
	import { default as QrCode } from 'qrious'

	export let errorCorrection = 'L'
	export let background = '#fff'
	export let color = '#000'
	export let size = '300'
	export let value = 'example.com/abcdefgh'
	export let padding = 10
	export let className = 'qrcode'

	let image = ''

	function generateQrCode() {
		if (!document || !window) {
			return
		}
		const QRcode = new QrCode()
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

	onMount(() => {
		generateQrCode()
	})
</script>

<img src={image} alt={value} class={className} />
