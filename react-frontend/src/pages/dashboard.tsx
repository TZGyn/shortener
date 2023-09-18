import { Navbar } from '@/App'
import { ThemeProvider } from '@/components/theme-provider'

import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

type Shortener = {
	id: number
	link: string
	code: string
}

const backend_url =
	import.meta.env.VITE_BACKEND_URL ?? 'http://192.168.100.40:3000'

export default function Dashboard() {
	const [shorteners, setShorteners] = useState<Shortener[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { shortenerId } = useParams()

	const getShorteners = async () => {
		setIsLoading(true)
		const response = await fetch(backend_url + '/link/' + shortenerId, {
			method: 'GET',
		})

		const data = (await response.json()).shorteners as Shortener[]
		console.log(data)

		setShorteners(data)
		setIsLoading(false)
	}

	useEffect(() => {
		if (!shorteners.length) {
			getShorteners()
		}
	}, [])

	return (
		<ThemeProvider
			defaultTheme='dark'
			storageKey='vite-ui-theme'>
			<Navbar />
		</ThemeProvider>
	)
}
