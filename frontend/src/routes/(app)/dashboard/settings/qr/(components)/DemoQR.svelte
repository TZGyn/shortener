<script lang="ts">
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'

	export let background = '#fff'
	export let color = '#000'
	export let value = 'abcdefghajskdadsj'
	export let cornerSquareStyle: 'dot' | 'square' | 'extra-rounded' =
		'square'
	export let dotStyle: 'square' | 'rounded' = 'square'
	export let existingQrImage: string | null = null
	export let qrImage: File | null = null

	let image = ''

	async function generateQrCode() {
		if (!document || !window) {
			return
		}

		try {
			const qrImageDataUrl = qrImage
				? URL.createObjectURL(qrImage)
				: existingQrImage || undefined

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
				image: qrImageDataUrl,
				imageOptions: {
					imageSize: 0.7,
					margin: 8,
				},
			})
			const blob = await qrcodestyling.getRawData()
			if (!blob) return
			image = URL.createObjectURL(blob)
		} catch (e) {
			image = ''
		}
	}

	$: browser &&
		background &&
		color &&
		cornerSquareStyle &&
		dotStyle &&
		(qrImage === null || qrImage) &&
		generateQrCode()

	onMount(() => {
		generateQrCode()
	})
</script>

<img src={image} alt={value} width={300} height={300} />
