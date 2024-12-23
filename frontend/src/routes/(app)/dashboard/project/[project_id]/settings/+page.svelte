<script lang="ts">
	import { env } from '$env/dynamic/public'
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import * as Card from '$lib/components/ui/card'
	import { Checkbox } from '$lib/components/ui/checkbox'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import { Separator } from '$lib/components/ui/separator'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import {
		CircleCheckBigIcon,
		CircleDashedIcon,
		CircleXIcon,
		InfoIcon,
		LoaderCircle,
	} from 'lucide-svelte'
	import { toast } from 'svelte-sonner'
	import { superForm } from 'sveltekit-superforms'
	import DnsInfo from './(components)/dns-info.svelte'
	import DnsTooltip from './(components)/dns-tooltip.svelte'
	import EditForm from './(components)/form.svelte'

	let { data } = $props()

	let deleteDialogOpen = $state(false)

	const form = superForm(data.deleteForm, {
		invalidateAll: 'force',
		resetForm: true,
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success('Project deleted')
				deleteDialogOpen = false
			}
			if (result.status === 400) {
				toast.error('Error deleting project')
			}
		},
	})

	const { form: formData, enhance, submitting } = form

	const customDomainForm = superForm(data.customDomainForm, {
		invalidateAll: 'force',
		resetForm: true,
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success('Custom domain updated')
			}
			if (result.status === 400) {
				toast.error('Error updating custom domain')
			}
		},
	})

	const {
		form: customDomainFormData,
		enhance: customDomainEnhance,
		submitting: customDomainSubmitting,
	} = customDomainForm

	const enableCustomDomainForm = superForm(
		data.enableCustomDomainForm,
		{
			onUpdated: ({ form }) => {
				if (form.valid) {
					toast.success(form.message)
				}
			},
		},
	)

	const {
		form: enableCustomDomainFormData,
		enhance: enableCustomDomainEnchance,
		submit: enableCustomDomainSubmit,
		submitting: enableCustomDomainSubmitting,
	} = enableCustomDomainForm
</script>

<ScrollArea>
	<div class="max-w-2xl space-y-6 px-10 py-4">
		<div>
			<h3 class="text-lg font-medium">Custom Domain</h3>
			<p class="text-muted-foreground text-sm">
				Update project domain.
			</p>
		</div>
		<Separator />

		<Card.Root>
			<Card.Content>
				<div class="flex items-center gap-4">
					<div class="">
						{#if data.project.domain_status === 'pending'}
							<CircleDashedIcon class="text-warning h-8 w-8" />
						{:else if data.project.domain_status === 'verified'}
							<CircleCheckBigIcon class="text-success h-8 w-8" />
						{:else if data.project.domain_status === 'disabled'}
							<CircleXIcon class="text-destructive h-8 w-8" />
						{/if}
					</div>
					<div class="flex-grow">
						{#if data.project.enable_custom_domain && data.project.custom_domain}
							<Card.Title>
								{data.project.custom_domain}
							</Card.Title>

							<Card.Description>custom domain</Card.Description>

							<Card.Description>
								<DnsTooltip
									domain={data.project.custom_domain}
									custom_ip={data.project.custom_ip}
									a_record={data.aRecord}
									aaaa_record={data.aaaaRecord}
									cname_record={data.cnameRecord} />
							</Card.Description>
						{:else}
							<Card.Title>
								{env.PUBLIC_SHORTENER_URL}
							</Card.Title>

							<Card.Description>default domain</Card.Description>
						{/if}
					</div>
					<div>
						{#if !data.project.enable_custom_domain}
							<Dialog.Root>
								<Dialog.Trigger
									class={buttonVariants({ variant: 'default' })}>
									Enable Custom Domain
								</Dialog.Trigger>

								<Dialog.Content>
									<Dialog.Header>
										<Dialog.Title>
											Are you absolutely sure?
										</Dialog.Title>
										<Dialog.Description>
											Enabling a custom domain will allow you to use
											your project with a custom domain.
										</Dialog.Description>
									</Dialog.Header>
									<form
										method="POST"
										action="?/enable_custom_domain"
										class="flex flex-col gap-6"
										use:enableCustomDomainEnchance>
										<Form.Field
											form={enableCustomDomainForm}
											name="enableDomain"
											class="flex flex-col gap-2">
											<Form.Control>
												{#snippet children({ props })}
													<Form.Label>Add Custom Domain</Form.Label>
													<div class="flex items-center space-x-2">
														<Input
															{...props}
															bind:value={$enableCustomDomainFormData.enableDomain}
															placeholder="your-custom-domain.com" />
													</div>
												{/snippet}
											</Form.Control>
											<Form.Description
												class="flex items-center justify-between gap-2">
												<Tooltip.Provider>
													<Tooltip.Root>
														<Tooltip.Trigger
															class="flex items-center gap-2">
															<InfoIcon class="h-4 w-4" />
															Update Project Domain (leave blank to use
															default)
														</Tooltip.Trigger>
														<Tooltip.Content>
															<p>
																Only include the domain name, not the
																protocol.
															</p>
															<p>
																Make sure the domain is pointing to
																our server.
															</p>
															<p>
																Please contact us if you need a custom
																domain.
															</p>
														</Tooltip.Content>
													</Tooltip.Root>
												</Tooltip.Provider>
											</Form.Description>
											<Form.FieldErrors />
										</Form.Field>
									</form>

									{#if data.cnameRecord || data.aRecord || data.aaaaRecord}
										<DnsInfo
											host={$enableCustomDomainFormData.enableDomain}
											cname_record={data.cnameRecord}
											a_record={data.aRecord}
											aaaa_record={data.aaaaRecord} />
									{/if}

									<Dialog.Footer>
										<Dialog.Close
											class={buttonVariants({ variant: 'outline' })}>
											Cancel
										</Dialog.Close>
										<Button onclick={enableCustomDomainSubmit}>
											{#if $enableCustomDomainSubmitting}
												<LoaderCircle class="animate-spin" />
											{/if}
											Enable
										</Button>
									</Dialog.Footer>
								</Dialog.Content>
							</Dialog.Root>
						{:else}
							<!-- <AlertDialog.Root>
								<AlertDialog.Trigger asChild let:builder>
									<Button builders={[builder]}>
										Disable Custom Domain
									</Button>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>
											Are you absolutely sure?
										</AlertDialog.Title>
										<AlertDialog.Description>
											Your custom domain setting will remain.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<AlertDialog.Action
											onclick={async () => {
												await fetch('?/disable_custom_domain', {
													method: 'POST',
													headers: {
														'Content-Type': 'multipart/form-data',
													},
												})
												await invalidateAll()
											}}>
											Continue
										</AlertDialog.Action>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root> -->
						{/if}
					</div>
				</div>
			</Card.Content>
		</Card.Root>
		{#if data.project.enable_custom_domain}
			<form
				method="POST"
				action="?/update_custom_domain"
				use:customDomainEnhance>
				<Form.Field
					form={customDomainForm}
					name="domain"
					class="flex flex-col gap-2">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Add Custom Domain</Form.Label>
							<div class="flex items-center space-x-2">
								<Input
									{...props}
									bind:value={$customDomainFormData.domain}
									placeholder="your-custom-domain.com" />
								<Form.Button class="w-fit">
									{#if $customDomainSubmitting}
										<LoaderCircle class="animate-spin" />
									{/if}
									Update
								</Form.Button>
							</div>
						{/snippet}
					</Form.Control>
					<Form.Description
						class="flex items-center justify-between gap-2">
						<Tooltip.Provider>
							<Tooltip.Root>
								<Tooltip.Trigger class="flex items-center gap-2">
									<InfoIcon class="h-4 w-4" />
									Update Project Domain (leave blank to use default)
								</Tooltip.Trigger>
								<Tooltip.Content>
									<p>
										Only include the domain name, not the protocol.
									</p>
									<p>
										Make sure the domain is pointing to our server.
									</p>
									<p>
										Please contact us if you need a custom domain.
									</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider>
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</form>
		{/if}

		<div>
			<h3 class="text-lg font-medium">Settings</h3>
			<p class="text-muted-foreground text-sm">
				Update project settings.
			</p>
		</div>
		<Separator />

		<EditForm
			data={data.form}
			isPro={data.user.plan !== 'free'}
			qrImageBase64={data.qrImageBase64} />

		<Separator />

		<div>
			<h3 class="text-lg font-medium">Danger Zone</h3>
		</div>
		<div class="border-destructive rounded-lg border">
			<div class="flex items-center justify-between p-4">
				<div class="flex flex-col gap-1">
					<span class="text-sm">Delete Project</span>
					<span class="text-muted-foreground text-xs">
						Permanently delete your project
					</span>
				</div>
				<Dialog.Root
					open={deleteDialogOpen}
					onOpenChange={(open) => (deleteDialogOpen = open)}>
					<Dialog.Trigger
						class={buttonVariants({ variant: 'destructive' })}>
						Delete Project
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>
								Are you sure absolutely sure?
							</Dialog.Title>
							<Dialog.Description>
								This action cannot be undone. This will permanently
								delete your project and all its associated data.
							</Dialog.Description>
						</Dialog.Header>
						<form method="POST" action="?/delete" use:enhance>
							<Form.Field
								{form}
								name="deleteShorteners"
								class="flex flex-col gap-2">
								<Form.Control>
									{#snippet children({ props })}
										<Input
											{...props}
											bind:value={$formData.deleteShorteners}
											type="hidden" />
										<div class="flex items-center gap-2">
											<Checkbox
												{...props}
												id="deleteShorteners"
												bind:checked={$formData.deleteShorteners} />
											<Form.Label for="deleteShorteners">
												Delete Shorteners?
											</Form.Label>
										</div>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<div class="flex justify-end gap-2">
								<Button
									variant="outline"
									onclick={() => (deleteDialogOpen = false)}>
									Cancel
								</Button>
								<Form.Button variant="destructive" class="w-fit">
									{#if $submitting}
										<LoaderCircle class="animate-spin" />
									{/if}
									Delete
								</Form.Button>
							</div>
						</form>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</div>
	</div>
</ScrollArea>
