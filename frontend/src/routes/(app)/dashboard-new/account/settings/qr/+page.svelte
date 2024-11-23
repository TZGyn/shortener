<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import { formSchema } from './schema'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { toast } from 'svelte-sonner'
	import DemoQr from './(components)/DemoQR.svelte'
	import { LoaderCircle } from 'lucide-svelte'
	import { Button } from '$lib/components/ui/button'
	import { cn } from '$lib/utils'

	let { data } = $props()

	let qrImageInput: HTMLInputElement

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		invalidateAll: 'force',
		resetForm: true,
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success('QR settings updated')
			}
			if (result.status === 400) {
				toast.error('Error updating QR settings')
			}
		},
	})

	const { form: formData, enhance, submitting } = form
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">QR</h3>
		<p class="text-muted-foreground text-sm">
			Update your QR settings.
		</p>
	</div>
	<Separator />

	<div class="flex justify-center">
		<DemoQr
			background={$formData.qr_background}
			color={$formData.qr_foreground}
			cornerSquareStyle={$formData.qrCornerSquareStyle}
			dotStyle={$formData.qrDotStyle}
			existingQrImage={data.qrImageBase64}
			qrImage={$formData.qrImage} />
	</div>

	<form
		method="POST"
		use:enhance
		enctype="multipart/form-data"
		class="flex flex-col gap-6">
		<Form.Field {form} name="qr_background">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Background Color</Form.Label>
					<Input {...props} bind:value={$formData.qr_background} />
				{/snippet}
			</Form.Control>
			<Form.Description>QR Code background color</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="qr_foreground">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Foreground Color</Form.Label>
					<Input {...props} bind:value={$formData.qr_foreground} />
				{/snippet}
			</Form.Control>
			<Form.Description>QR Code foreground color</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="qrImage">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>
						Image <span class="text-brand">(Pro)</span>
					</Form.Label>
					<div>
						{#if !$formData.qrImage && !data.qrImageBase64}
							<button
								onclick={(e) => {
									e.preventDefault()
									qrImageInput.click()
								}}>
								<div
									class="flex h-16 w-16 items-center justify-center rounded-lg border-4 border-dashed">
								</div>
							</button>
						{:else}
							<button
								onclick={(e) => {
									e.preventDefault()
									qrImageInput.click()
								}}>
								<img
									src={$formData.qrImage
										? URL.createObjectURL($formData.qrImage)
										: data.qrImageBase64}
									alt={'image'}
									width={64}
									height={64} />
							</button>
						{/if}
					</div>
					<Form.Description>Click to edit</Form.Description>
					<input
						{...props}
						hidden
						bind:this={qrImageInput}
						accept="image/png, image/jpeg"
						type="file"
						disabled={data.user.plan === 'free'}
						oninput={(e) => {
							const file = e.currentTarget.files?.item(0)
							if (!file) return

							if (file.size > 2097152) {
								toast.error('Too Big! Max file size is 2MB')
								return
							}
							$formData.qrImage = file
						}} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="qrCornerSquareStyle">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>
						Corner Square Style <span class="text-brand">(Pro)</span>
					</Form.Label>
					<Input
						{...props}
						class="hidden"
						hidden
						aria-hidden
						bind:value={$formData.qrCornerSquareStyle} />
				{/snippet}
			</Form.Control>
			<div class="flex gap-4">
				<Button
					disabled={data.user.plan === 'free'}
					onclick={() => ($formData.qrCornerSquareStyle = 'square')}
					class={cn(
						'flex flex-col gap-3 border p-12',
						$formData.qrCornerSquareStyle === 'square'
							? 'bg-primary-foreground'
							: 'bg-transparent',
					)}>
					<div class="border-brand border-4 p-4"></div>
					Square
				</Button>
				<Button
					disabled={data.user.plan === 'free'}
					onclick={() => ($formData.qrCornerSquareStyle = 'dot')}
					class={cn(
						'flex flex-col gap-3 border p-12',
						$formData.qrCornerSquareStyle === 'dot'
							? 'bg-primary-foreground'
							: 'bg-transparent',
					)}>
					<div class="border-brand rounded-full border-4 p-4"></div>
					Dot
				</Button>
				<Button
					disabled={data.user.plan === 'free'}
					onclick={() =>
						($formData.qrCornerSquareStyle = 'extra-rounded')}
					class={cn(
						'flex flex-col gap-3 border p-12',
						$formData.qrCornerSquareStyle === 'extra-rounded'
							? 'bg-primary-foreground'
							: 'bg-transparent',
					)}>
					<div class="border-brand rounded-lg border-4 p-4"></div>
					Rounded
				</Button>
			</div>
		</Form.Field>
		<Form.Field {form} name="qrDotStyle">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>
						Dot Style <span class="text-brand">(Pro)</span>
					</Form.Label>
					<Input
						{...props}
						class="hidden"
						hidden
						aria-hidden
						bind:value={$formData.qrDotStyle} />
				{/snippet}
			</Form.Control>
			<div class="flex gap-4">
				<Button
					disabled={data.user.plan === 'free'}
					onclick={() => ($formData.qrDotStyle = 'square')}
					class={cn(
						'flex flex-col gap-3 border p-12',
						$formData.qrDotStyle === 'square'
							? 'bg-primary-foreground'
							: 'bg-transparent',
					)}>
					<div class="border-brand border-4"></div>
					Square
				</Button>
				<Button
					disabled={data.user.plan === 'free'}
					onclick={() => ($formData.qrDotStyle = 'rounded')}
					class={cn(
						'flex flex-col gap-3 border p-12',
						$formData.qrDotStyle === 'rounded'
							? 'bg-primary-foreground'
							: 'bg-transparent',
					)}>
					<div class="border-brand w-4 rounded-lg border-4"></div>
					Rounded
				</Button>
			</div>
		</Form.Field>

		<Form.Button class="w-fit self-end">
			{#if $submitting}
				<LoaderCircle class="animate-spin" />
			{/if}
			Save
		</Form.Button>
	</form>
</div>
