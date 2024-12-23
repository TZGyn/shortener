<script lang="ts">
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'

	let {
		background = '#fff',
		color = '#000',
		value = 'abcdefghajskdadsj',
		cornerSquareStyle = 'square',
		dotStyle = 'square',
		existingQrImage = null,
		qrImage = null,
	}: {
		background: string
		color: string
		value: string
		cornerSquareStyle: 'dot' | 'square' | 'extra-rounded'
		dotStyle: 'square' | 'rounded'
		existingQrImage: string | null
		qrImage: File | null | undefined
	} = $props()

	let image = $state('')

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

	$effect(() => {
		if (
			browser &&
			background &&
			color &&
			cornerSquareStyle &&
			dotStyle &&
			(qrImage === null || qrImage)
		) {
			generateQrCode()
		}
	})

	onMount(() => {
		generateQrCode()
	})
</script>

<img src={image} alt={value} width={300} height={300} />
