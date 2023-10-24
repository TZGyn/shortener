<script setup lang="ts">
import ToggleThemeButton from './ToggleThemeButton.vue'
</script>
<template>
	<div className="flex justify-center border-b border-b-border px-2">
		<div
			className="flex w-full max-w-6xl items-center justify-between py-2">
			<div className="cursor-pointer font-bold"> Shortener </div>
			<div className="flex items-center gap-2">
				<ToggleThemeButton />
			</div>
		</div>
	</div>
</template>
