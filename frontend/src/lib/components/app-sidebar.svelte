<script lang="ts" module>
	import AudioWaveform from 'lucide-svelte/icons/audio-waveform'
	import Command from 'lucide-svelte/icons/command'
	import GalleryVerticalEnd from 'lucide-svelte/icons/gallery-vertical-end'
</script>

<script lang="ts">
	import NavMain from '$lib/components/nav-main.svelte'
	import NavUser from '$lib/components/nav-user.svelte'
	import TeamSwitcher from '$lib/components/team-switcher.svelte'
	import * as Sidebar from '$lib/components/ui/sidebar/index.js'
	import type { ComponentProps } from 'svelte'
	import {
		BlocksIcon,
		CreditCardIcon,
		HomeIcon,
		LinkIcon,
		SettingsIcon,
	} from 'lucide-svelte'
	import { page } from '$app/stores'
	import type { User } from 'lucia'

	let {
		ref = $bindable(null),
		user,
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { user: User } = $props()

	let data = $derived({
		user: {
			name: user.username || '',
			email: user.email,
			avatar: '/avatars/shadcn.jpg',
			isPro: user.plan === 'pro' || user.plan === 'owner',
		},
		teams: [
			{
				name: 'Acme Inc',
				logo: GalleryVerticalEnd,
				plan: 'Enterprise',
			},
			{
				name: 'Acme Corp.',
				logo: AudioWaveform,
				plan: 'Startup',
			},
			{
				name: 'Evil Corp.',
				logo: Command,
				plan: 'Free',
			},
		],
		navMain: [
			{
				title: 'Home',
				url: '/dashboard',
				icon: HomeIcon,
				isActive: $page.url.pathname === '/dashboard',
			},
			{
				title: 'Links',
				url: '/dashboard/links',
				icon: LinkIcon,
				isActive: $page.url.pathname.startsWith('/dashboard/links'),
			},
			{
				title: 'Projects',
				url: '/dashboard/projects',
				icon: BlocksIcon,
				isActive: $page.url.pathname.startsWith(
					'/dashboard/projects',
				),
			},
			{
				title: 'Settings',
				url: '/dashboard/settings/account',
				icon: SettingsIcon,
				isActive: $page.url.pathname.startsWith(
					'/dashboard/settings',
				),
			},
		],
	})
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<NavUser user={data.user} />
		<!-- <TeamSwitcher teams={data.teams} /> -->
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer></Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
