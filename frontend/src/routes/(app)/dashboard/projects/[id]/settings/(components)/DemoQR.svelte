<script>
	import { onMount } from 'svelte'
	import QRCodeStyling from 'qr-code-styling'
	import { browser } from '$app/environment'

	export let background = '#fff'
	export let color = '#000'
	export let value = 'example.com/abcdefgh'

	let image = ''

	async function generateQrCode() {
		if (!document || !window) {
			return
		}

		try {
			const qrcodestyling = new QRCodeStyling({
				data: value,
				width: 300,
				height: 300,
				margin: 10,
				qrOptions: {
					errorCorrectionLevel: 'L',
					typeNumber: 0,
				},
				backgroundOptions: {
					color: background,
				},
				dotsOptions: {
					color: color,
				},
				cornersSquareOptions: {
					type: 'square',
				},
			})
			const blob = await qrcodestyling.getRawData()
			if (!blob) return
			image = URL.createObjectURL(blob)
		} catch (e) {
			image = ''
		}
	}

	$: browser && background && color && generateQrCode()

	onMount(() => {
		generateQrCode()
	})
</script>

<img src={image} alt={value} width={300} height={300} />
