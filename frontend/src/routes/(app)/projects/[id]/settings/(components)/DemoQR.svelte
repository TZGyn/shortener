<script>
	import { onMount } from 'svelte'
	import QRCode from 'qrcode'
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
			image = await QRCode.toDataURL(value, {
				errorCorrectionLevel: 'L',
				margin: 1,
				scale: 20,
				color: {
					light: background,
					dark: color,
				},
			})
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
