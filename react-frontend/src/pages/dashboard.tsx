import { Navbar } from '@/App'
import { ThemeProvider } from '@/components/theme-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type Shortener = {
	id: number
	link: string
	code: string
	visitors: {
		visited_at: Date
		country: string
	}[]
}

const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
] as const

type VisitorData = { name: string; total: number }
let visitor_data: VisitorData[] = []
months.forEach((months) => {
	visitor_data.push({ name: months, total: 0 })
})

const backend_url =
	import.meta.env.VITE_BACKEND_URL ?? 'http://192.168.100.40:3000'

export default function Dashboard() {
	const [shorteners, setShorteners] = useState<Shortener[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { shortenerId } = useParams()

	const [visitorData, setVisitorData] = useState<VisitorData[]>(visitor_data)

	const getShorteners = async () => {
		setIsLoading(true)
		const response = await fetch(backend_url + '/link/' + shortenerId, {
			method: 'GET',
		})

		const data = (await response.json()).shorteners as Shortener[]

		setShorteners(data)
		calculateShortenerData(data[0])
		setIsLoading(false)
	}

	const calculateShortenerData = (shortener: Shortener) => {
		const visitors = shortener.visitors
		let data: VisitorData[] = []
		months.forEach((months) => {
			data.push({ name: months, total: 0 })
		})
		let visitor_data_copy = data

		visitors.forEach((visitor) => {
			const month = new Date(visitor.visited_at).getMonth()
			visitor_data_copy[month] = {
				...visitor_data_copy[month],
				total: visitor_data_copy[month].total + 1,
			}
			setVisitorData(visitor_data_copy)
		})
		console.log(visitorData)
	}

	useEffect(() => {
		if (!shorteners.length) {
			getShorteners()
		}
	}, [])

	const thisMonth = new Date().getMonth()

	return (
		<ThemeProvider
			defaultTheme='dark'
			storageKey='vite-ui-theme'>
			<Navbar />
			<div className='flex justify-center px-2 pt-8'>
				<div className='max-w-6xl flex-1 space-y-4'>
					<div className='text-lg font-bold'>
						{backend_url + '/' + shortenerId}
					</div>
					<div className='space-y-4'>
						<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
							<Card>
								<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
									<CardTitle className='text-sm font-medium'>
										This Month's Visitors
									</CardTitle>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										className='h-4 w-4 text-muted-foreground'>
										<path d='M22 12h-4l-3 9L9 3l-3 9H2' />
									</svg>
								</CardHeader>
								<CardContent>
									<div className='text-2xl font-bold'>
										{visitorData[thisMonth]?.total ?? 0}
									</div>
									<p className='text-xs text-muted-foreground'>
										{`+ ${
											visitorData[thisMonth]?.total ??
											0 -
												visitorData[thisMonth - 1]
													?.total ??
											0
										} since last month`}
									</p>
								</CardContent>
							</Card>
						</div>
						<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
							<Card className='col-span-4'>
								<CardHeader>
									<CardTitle>Visitors</CardTitle>
								</CardHeader>
								<CardContent className='pl-2'>
									<Overview visitorData={visitorData} />
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</ThemeProvider>
	)
}

export function Overview({ visitorData }: { visitorData: VisitorData[] }) {
	return (
		<ResponsiveContainer
			width='100%'
			height={350}>
			<BarChart data={visitorData}>
				<XAxis
					dataKey='name'
					stroke='#888888'
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke='#888888'
					fontSize={12}
					allowDecimals={false}
					tickLine={false}
					axisLine={false}
				/>
				<Bar
					dataKey='total'
					fill='#006FEE'
					radius={[4, 4, 0, 0]}
				/>
			</BarChart>
		</ResponsiveContainer>
	)
}
