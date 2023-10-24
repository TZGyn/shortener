<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
// const isDark = useDark({
// 	selector: 'body',
// 	attribute: 'color-scheme',
// 	valueDark: 'dark',
// 	valueLight: 'light',
// })
const toggleDark = useToggle(isDark)
</script>

<template>
	<Button @click="() => toggleDark()">
		<Moon v-if="isDark" />
		<Sun v-else />
	</Button>
</template>
