<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js'
	import * as Form from '$lib/components/ui/form'
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Check, LoaderCircleIcon } from 'lucide-svelte'
	import type { PageData } from './$types'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { cancelSubscriptionSchema } from './schema'
	import { superForm } from 'sveltekit-superforms'
	import { toast } from 'svelte-sonner'
	import { ScrollArea } from '$lib/components/ui/scroll-area'

	export let data: PageData

	let cancelPlanDialogOpen = false

	const cancelSubscriptionForm = superForm(
		data.cancel_subscription_form,
		{
			validators: zodClient(cancelSubscriptionSchema),
			onUpdate: ({ form }) => {
				if (!form.valid) {
					toast.error(form.message)
				}
			},
			onUpdated: ({ form }) => {
				if (form.valid) {
					toast.success(form.message)
					cancelPlanDialogOpen = false
				}
			},
		},
	)

	const {
		enhance: enhanceCancelSubscription,
		submitting: submittingCancelSubscription,
	} = cancelSubscriptionForm
</script>

<div class="flex h-auto flex-col overflow-hidden p-10">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Pricing</h2>
		<p class="text-muted-foreground">Checkout our pricings here.</p>
	</div>
	<Separator class="mt-4 lg:mt-6" />

	<ScrollArea>
		<div
			class="flex w-full flex-wrap-reverse justify-center gap-8 pt-6">
			<div class="flex w-[400px] gap-8 rounded-lg border p-8">
				<div class="flex w-full flex-col gap-3 text-start">
					<h2 class="text-2xl font-bold">Free</h2>
					<p class="text-muted-foreground">
						No credit card required.
					</p>
					<Separator />
					<div class="flex flex-col gap-2">
						<div class="flex items-end gap-2">
							<h1 class="text-5xl font-bold">$0</h1>
							<span>/month</span>
						</div>
						<span class="text-muted-foreground">Free Forever</span>
					</div>
					<Separator />
					<div class="flex h-full flex-col justify-between gap-12">
						<div class="flex flex-col gap-4">
							<div class="flex items-center gap-2">
								<Check class="text-brand" />
								<p>Unlimited Links</p>
							</div>
							<div class="flex items-center gap-2">
								<Check class="text-brand" />
								<p>Unlimited Projects</p>
							</div>
							<div class="flex items-center gap-2">
								<Check class="text-brand" />
								<p>Click history up to 1 month</p>
							</div>
						</div>
						{#if data.user.plan === 'owner'}
							<Button variant={'brand'} disabled>Owner</Button>
						{:else if data.user.plan === 'free'}
							<Button variant={'default'} disabled>
								Current Plan
							</Button>
						{:else}
							<Button variant={'brand'} disabled>Select Plan</Button>
						{/if}
					</div>
				</div>
			</div>
			<div
				class="border-brand relative flex w-[400px] gap-8 rounded-lg border p-8">
				<div
					class="bg-brand text-brand-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3">
					Recommended
				</div>
				<div class="flex w-full flex-col gap-3 text-start">
					<h2 class="text-2xl font-bold">Pro</h2>
					<p class="text-muted-foreground">
						More customizations, more data.
					</p>
					<Separator />
					<div class="flex flex-col gap-2">
						<div class="flex items-end gap-2">
							<h1 class="text-5xl font-bold">$9</h1>
							<span>/month</span>
						</div>
						<span class="text-muted-foreground">Billed Monthly</span>
					</div>
					<Separator />
					<div class="flex h-full flex-col justify-between gap-12">
						<div class="flex flex-col gap-4">
							<div class="flex items-center gap-2">
								<Check class="text-brand" />
								<p>Everything in free</p>
							</div>
							<div class="flex items-center gap-2">
								<Check class="text-brand" />
								<p>5 custom domains</p>
								<!-- <Tooltip.Root>
								<Tooltip.Trigger class="flex items-center gap-1">
									<InfoIcon class="h-4 w-4" />
								</Tooltip.Trigger>
								<Tooltip.Content>
									Additional domains are $3 per domain
								</Tooltip.Content>
							</Tooltip.Root> -->
							</div>
							<div class="flex items-center gap-2">
								<Check class="text-brand" />
								<p>2 years of tracked clicks and history</p>
							</div>
							<div class="flex items-center gap-2">
								<Check class="text-brand" />
								<p>Custom QR Code</p>
							</div>
						</div>
						{#if data.user.plan === 'owner'}
							<Button variant={'brand'} disabled>Owner</Button>
						{:else if data.user.plan === 'pro'}
							<Dialog.Root bind:open={cancelPlanDialogOpen}>
								<Dialog.Trigger
									class={buttonVariants({ variant: 'destructive' })}>
									Cancel Plan
								</Dialog.Trigger>
								<Dialog.Content class="sm:max-w-[425px]">
									<Dialog.Header>
										<Dialog.Title>Cancel plan?</Dialog.Title>
										<Dialog.Description>
											Your subscription will still be valid until the
											next billing
										</Dialog.Description>
									</Dialog.Header>
									<Dialog.Footer>
										<Button
											variant={'outline'}
											on:click={() => (cancelPlanDialogOpen = false)}>
											Cancel
										</Button>
										<form
											method="POST"
											use:enhanceCancelSubscription
											class="flex flex-col gap-6"
											action="?/cancel_subscription">
											<Form.Button
												class="w-fit"
												variant="destructive"
												disabled={$submittingCancelSubscription ||
													!data.user.plan}>
												{#if $submittingCancelSubscription}
													<LoaderCircleIcon class="animate-spin" />
												{/if}
												Proceed
											</Form.Button>
										</form>
									</Dialog.Footer>
								</Dialog.Content>
							</Dialog.Root>
						{:else}
							<Button
								href={'/dashboard/billing/plan/pro'}
								variant={'brand'}>
								Select Plan
							</Button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</ScrollArea>
</div>
