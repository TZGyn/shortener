<script lang="ts">
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'

	export let background = '#fff'
	export let color = '#000'
	export let value = 'example.com/abcdefgh'
	export let cornerSquareStyle: 'dot' | 'square' | 'extra-rounded' =
		'square'
	export let dotStyle: 'square' | 'rounded' = 'square'

	let image = ''

	async function generateQrCode() {
		if (!document || !window) {
			return
		}

		try {
			const qrcodestyling = new (
				await import('qr-code-styling')
			).default({
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
					type: dotStyle,
				},
				cornersSquareOptions: {
					type: cornerSquareStyle,
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
		generateQrCode()

	onMount(() => {
		generateQrCode()
	})
</script>

<img src={image} alt={value} width={300} height={300} />
