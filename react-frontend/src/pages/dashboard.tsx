import { Navbar } from '@/App'
import { ThemeProvider } from '@/components/theme-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { ArrowRight, Copy } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

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
type CountryData = {
	country_code: string
	country: string
	visitor_count: string
}
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
	const [countryVisitor, setCountryVisitor] = useState<CountryData[]>([])

	const [visitorData, setVisitorData] = useState<VisitorData[]>(visitor_data)

	const getShorteners = async () => {
		setIsLoading(true)
		const response = await fetch(backend_url + '/link/' + shortenerId, {
			method: 'GET',
		})
		const data = await response.json()
		const shortenersData = data.shorteners as Shortener[]
		const countryData = data.visitors as CountryData[]

		setShorteners(shortenersData)
		setCountryVisitor(countryData)
		calculateShortenerData(shortenersData[0])
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

	const { toast } = useToast()
	const copyLinkToClipboard = async (code: string) => {
		await navigator.clipboard.writeText(backend_url + '/' + code)
		toast({
			title: 'Link Copied',
			description: `Copied ${backend_url + '/' + code} To Clipboard`,
		})
	}

	useEffect(() => {
		if (!shorteners.length) {
			getShorteners()
		}
	}, [])

	const thisMonth = new Date().getMonth()

	const getVisitorGrowth = (visitorData: VisitorData[]) => {
		const growth = visitorData[thisMonth]?.total
			? visitorData[thisMonth].total -
					visitorData[thisMonth - 1]?.total ?? 0
			: 0

		if (growth < 0) {
			return `- ${Math.abs(growth)}`
		}

		return `+ ${growth}`
	}

	return (
		<ThemeProvider
			defaultTheme='dark'
			storageKey='vite-ui-theme'>
			<Navbar />
			<div className='flex justify-center px-2 pt-8'>
				<div className='max-w-6xl flex-1 space-y-4'>
					<div className='flex flex-wrap items-center gap-4 text-lg font-bold'>
						<div
							className='cursor-pointer select-none'
							onClick={() =>
								copyLinkToClipboard(shorteners[0].code)
							}>
							<div className='flex items-center justify-between gap-4 rounded bg-secondary/70 p-2'>
								{backend_url + '/' + shortenerId}
								<Copy className='h-[1.2rem] w-[1.2rem]' />
							</div>
						</div>
						<ArrowRight />
						{shorteners[0]?.link}
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
										{`${getVisitorGrowth(
											visitorData
										)} since last month`}
									</p>
								</CardContent>
							</Card>
						</div>
						<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
							<Card className='col-span-4'>
								<CardHeader>
									<CardTitle>Visitors</CardTitle>
								</CardHeader>
								<CardContent className='w-full pl-2'>
									<Overview visitorData={visitorData} />
								</CardContent>
							</Card>
							<Card className='col-span-4 lg:col-span-3'>
								<CardHeader>
									<CardTitle>
										Top Countries By Vistors
									</CardTitle>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className='w-[100px]'></TableHead>
												<TableHead>Country</TableHead>
												<TableHead className='text-right'>
													Visitor(s)
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{countryVisitor.map((country) => {
												return (
													<TableRow>
														<TableCell>
															<img
																src={`https://flagsapi.com/${country.country_code}/flat/64.png`}
															/>
														</TableCell>
														<TableCell>
															<div>
																{
																	country.country
																}
															</div>
														</TableCell>
														<TableCell className='text-right'>
															{
																country.visitor_count
															}
														</TableCell>
													</TableRow>
												)
											})}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
			<Toaster />
		</ThemeProvider>
	)
}

export function Overview({ visitorData }: { visitorData: VisitorData[] }) {
	return (
		<ResponsiveContainer
			width={'95%'}
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
