<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Loader2, GithubIcon } from 'lucide-vue-next'

import { cn } from '@/lib/utils'
import { customAxios } from '@/lib/fetch'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const isLoading = ref(false)

type LoginSchema = {
	email: string
	password: string
}

const loginData: LoginSchema = reactive({
	email: '',
	password: '',
})

async function onSubmit(event: Event) {
	event.preventDefault()
	isLoading.value = true

	try {
		const response = await customAxios.post('/login', loginData)
	} catch (error) {
		console.log(error)
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<div :class="cn('grid gap-6', $attrs.class ?? '')">
		<form @submit="onSubmit">
			<div class="grid gap-6">
				<div class="grid gap-1">
					<Label for="email"> Email </Label>
					<Input
						id="email"
						v-model="loginData.email"
						placeholder="name@example.com"
						type="email"
						auto-capitalize="none"
						auto-complete="email"
						auto-correct="off"
						:disabled="isLoading" />
				</div>
				<div class="grid gap-1">
					<Label for="password"> Password </Label>
					<Input
						id="password"
						v-model="loginData.password"
						placeholder="••••••••"
						type="password"
						:disabled="isLoading" />
				</div>
				<Button :disabled="isLoading">
					<Loader2
						v-if="isLoading"
						class="mr-2 h-4 w-4 animate-spin" />
					Sign In
				</Button>
			</div>
		</form>
		<!-- <div class="relative"> -->
		<!-- 	<div class="absolute inset-0 flex items-center"> -->
		<!-- 		<span class="w-full border-t" /> -->
		<!-- 	</div> -->
		<!-- 	<div class="relative flex justify-center text-xs uppercase"> -->
		<!-- 		<span class="bg-background px-2 text-muted-foreground"> -->
		<!-- 			Or continue with -->
		<!-- 		</span> -->
		<!-- 	</div> -->
		<!-- </div> -->
		<!-- <Button -->
		<!-- 	variant="outline" -->
		<!-- 	type="button" -->
		<!-- 	:disabled="isLoading"> -->
		<!-- 	<Loader2 -->
		<!-- 		v-if="isLoading" -->
		<!-- 		class="mr-2 h-4 w-4 animate-spin" /> -->
		<!-- 	<GithubIcon -->
		<!-- 		v-else -->
		<!-- 		class="mr-2 h-4 w-4" /> -->
		<!-- 	GitHub -->
		<!-- </Button> -->
	</div>
</template>
