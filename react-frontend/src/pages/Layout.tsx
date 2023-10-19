import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/App.tsx'
import { Outlet } from 'react-router-dom'

export function Layout() {
	return (
		<ThemeProvider
			defaultTheme='dark'
			storageKey='vite-ui-theme'>
			<Navbar />
			<Outlet />
		</ThemeProvider>
	)
}
