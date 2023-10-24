import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/lib/auth'
import HomeView from '@/views/HomeView.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignUpPage from '@/views/SignUpPage.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			component: HomeView,
		},
		{
			path: '/login',
			name: 'login',
			component: LoginPage,
		},
		{
			path: '/signup',
			name: 'signup',
			component: SignUpPage,
		},
	],
})

router.beforeEach(async (to) => {
	const isLoggedIn = await isAuthenticated()
	if (isLoggedIn && (to.name === 'login' || to.name === 'signup')) {
		return { name: 'home' }
	}
	if (!isLoggedIn && to.name !== 'login' && to.name !== 'signup') {
		return { name: 'login' }
	}
})

export default router
