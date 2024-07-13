<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Card from '$lib/components/ui/card'
	import EditForm from './(components)/form.svelte'
	import * as Form from '$lib/components/ui/form'
	import { superForm } from 'sveltekit-superforms'
	import { toast } from 'svelte-sonner'
	import { Checkbox } from '$lib/components/ui/checkbox'
	import { Input } from '$lib/components/ui/input'
	import { LoaderCircle } from 'lucide-svelte'
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import * as Alert from '$lib/components/ui/alert'
	import {
		InfoIcon,
		CircleDashedIcon,
		CircleXIcon,
		CircleCheckBigIcon,
		TriangleAlertIcon,
	} from 'lucide-svelte'
	import { env } from '$env/dynamic/public'
	import { invalidateAll } from '$app/navigation'

	export let data

	let deleteDialogOpen = false

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
</script>

<ScrollArea>
	<div class="max-w-2xl space-y-6 px-10 py-4">
		<div>
			<h3 class="text-lg font-medium">Custom Domain</h3>
			<p class="text-sm text-muted-foreground">
				Update project domain.
			</p>
		</div>
		<Separator />

		<Card.Root>
			<Card.Header>
				<div class="flex items-center gap-4">
					<div class="">
						{#if data.project.domain_status === 'pending'}
							<CircleDashedIcon class="h-8 w-8 text-warning" />
						{:else if data.project.domain_status === 'verified'}
							<CircleCheckBigIcon class="h-8 w-8 text-success" />
						{:else if data.project.domain_status === 'disabled'}
							<CircleXIcon class="h-8 w-8 text-destructive" />
						{/if}
					</div>
					<div class="flex-grow">
						{#if data.project.enable_custom_domain && data.project.custom_domain}
							<Card.Title>
								{data.project.custom_domain}
							</Card.Title>

							<Card.Description>custom domain</Card.Description>

							<Card.Description>
								<Tooltip.Root>
									<Tooltip.Trigger class="flex items-center gap-1">
										<InfoIcon class="h-4 w-4" />
										{#if data.project.custom_ip}
											{data.project.custom_ip}
										{:else if env.PUBLIC_SHORTENER_IP}
											{env.PUBLIC_SHORTENER_IP}
										{:else}
											{'Public IP not found'}
										{/if}
									</Tooltip.Trigger>
									<Tooltip.Content>
										{#if data.project.custom_ip}
											{'Create a CNAME record for ' +
												data.project.custom_domain +
												' to ' +
												data.project.custom_ip}
										{:else if env.PUBLIC_SHORTENER_IP}
											{'Create a A record for ' +
												data.project.custom_domain +
												' to ' +
												env.PUBLIC_SHORTENER_IP}
										{:else}
											{'Public IP not found'}
										{/if}
									</Tooltip.Content>
								</Tooltip.Root>
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
							<AlertDialog.Root>
								<AlertDialog.Trigger asChild let:builder>
									<Button builders={[builder]}>
										Enable Custom Domain
									</Button>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>
											Are you absolutely sure?
										</AlertDialog.Title>
										<Alert.Root variant="destructive">
											<TriangleAlertIcon class="h-4 w-4" />
											<Alert.Description>
												Disabling custom domain is not available yet.
											</Alert.Description>
										</Alert.Root>
										<AlertDialog.Description>
											Enabling a custom domain will allow you to use
											your project with a custom domain.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<AlertDialog.Action
											on:click={async () => {
												await fetch('?/enable_custom_domain', {
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
							</AlertDialog.Root>
						{:else}
							<AlertDialog.Root>
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
											on:click={async () => {
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
							</AlertDialog.Root>
						{/if}
					</div>
				</div>
			</Card.Header>
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
					<Form.Control let:attrs>
						<Form.Label>Add Custom Domain</Form.Label>
						<div class="flex items-center space-x-2">
							<Input
								{...attrs}
								bind:value={$customDomainFormData.domain}
								placeholder="your-custom-domain.com" />
							<Form.Button class="w-fit">
								{#if $customDomainSubmitting}
									<LoaderCircle class="animate-spin" />
								{/if}
								Update
							</Form.Button>
						</div>
					</Form.Control>
					<Form.Description
						class="flex items-center justify-between gap-2">
						<Tooltip.Root>
							<Tooltip.Trigger class="flex items-center gap-2">
								<InfoIcon class="h-4 w-4" />
								Update Project Domain (leave blank to use default)
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>Only include the domain name, not the protocol.</p>
								<p>Make sure the domain is pointing to our server.</p>
								<p>Please contact us if you need a custom domain.</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</form>
		{/if}

		<div>
			<h3 class="text-lg font-medium">Settings</h3>
			<p class="text-sm text-muted-foreground">
				Update project settings.
			</p>
		</div>
		<Separator />

		<EditForm data={data.form} />

		<Separator />

		<div>
			<h3 class="text-lg font-medium">Danger Zone</h3>
		</div>
		<div class="rounded-lg border border-destructive">
			<div class="flex items-center justify-between p-4">
				<div class="flex flex-col gap-1">
					<span class="text-sm">Delete Project</span>
					<span class="text-xs text-muted-foreground">
						Permanently delete your project
					</span>
				</div>
				<Dialog.Root
					open={deleteDialogOpen}
					onOpenChange={(open) => (deleteDialogOpen = open)}>
					<Dialog.Trigger>
						<Button variant="destructive">Delete Project</Button>
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
								<Form.Control let:attrs>
									<Input
										{...attrs}
										bind:value={$formData.deleteShorteners}
										type="hidden" />
									<div class="flex items-center gap-2">
										<Checkbox
											{...attrs}
											id="deleteShorteners"
											bind:checked={$formData.deleteShorteners} />
										<Form.Label for="deleteShorteners">
											Delete Shorteners?
										</Form.Label>
									</div>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<div class="flex justify-end gap-2">
								<Button
									variant="outline"
									on:click={() => (deleteDialogOpen = false)}>
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
