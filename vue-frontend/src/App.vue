<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()
</script>

<template>
	<Navbar v-if="route.name !== 'login' && route.name !== 'signup'" />
	<RouterView />
</template>
