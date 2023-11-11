<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Loader2, LoaderIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };

	let isLoading = false;
	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}
</script>

<div class={cn('grid gap-6', className)} {...$$restProps}>
	<form on:submit|preventDefault={onSubmit}>
		<div class="grid gap-4">
			<div class="grid gap-1">
				<Label for="email">Email</Label>
				<Input
					id="email"
					placeholder="name@example.com"
					type="email"
					autocapitalize="none"
					autocomplete="email"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
			<div class="grid gap-1">
				<Label for="password">Password</Label>
				<Input
					id="password"
					placeholder="••••••••"
					type="password"
					disabled={isLoading}
				/>
			</div>
			<Button disabled={isLoading} type="submit" class="flex gap-2">
				{#if isLoading}
					<Loader2 class="animate-spin" />
				{/if}
				Sign In
			</Button>
		</div>
	</form>
</div>
