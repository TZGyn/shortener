<script setup lang="ts">
import { Link } from 'lucide-vue-next'
import UserLoginForm from '@/components/UserLoginForm.vue'
</script>

<template>
	<div
		class="container relative grid h-full flex-col items-center justify-center xl:max-w-none xl:grid-cols-7 xl:px-0">
		<div
			class="absolute left-10 top-10 z-20 flex items-center text-lg font-medium">
			<Link class="mr-2 h-6 w-6" />
			Shortener
		</div>
		<div
			class="relative col-span-4 hidden h-full flex-col bg-muted p-10 text-white dark:border-r xl:flex">
			<div class="absolute inset-0 bg-zinc-900" />
		</div>
		<div class="col-span-3 lg:p-8">
			<div
				class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div class="flex flex-col gap-10 text-center">
					<div class="flex flex-col gap-2 pb-8">
						<h1 class="text-2xl font-semibold tracking-tight">
							Welcome Back
						</h1>
						<p class="text-sm text-muted-foreground">
							Sign in to your account
						</p>
					</div>
					<UserLoginForm />
					<p class="px-8 text-center text-sm text-muted-foreground">
						Don't have an account?
						<RouterLink
							to="signup"
							class="underline underline-offset-4 hover:text-primary">
							Sign Up Now
						</RouterLink>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
