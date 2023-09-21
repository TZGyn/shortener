import { ModeToggle } from '@/components/mode-toggle'
import { ThemeProvider } from '@/components/theme-provider'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'

import { Copy, Loader2, MoreHorizontal, Settings } from 'lucide-react'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const backend_url =
	import.meta.env.VITE_BACKEND_URL ?? 'http://192.168.100.40:3000'

type Shortener = {
	id: number
	link: string
	code: string
	visitor_count: string
}

export default function App() {
	const [shorteners, setShorteners] = useState<Shortener[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const getShorteners = async () => {
		setIsLoading(true)
		const response = await fetch(backend_url + '/link', {
			method: 'GET',
		})

		const data = (await response.json()).shorteners as Shortener[]

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
			<Navbar getShorteners={getShorteners} />
			<div className='flex justify-center px-2 pt-8'>
				<div className='w-full max-w-6xl'>
					<ShortenerTable
						shorteners={shorteners}
						isLoading={isLoading}
					/>
				</div>
			</div>
			<Toaster />
		</ThemeProvider>
	)
}

export const Navbar = ({
	getShorteners,
}: {
	getShorteners?: () => Promise<void>
}) => {
	const navigate = useNavigate()
	return (
		<div className='flex justify-center border-b border-b-border px-2'>
			<div className='flex w-full max-w-6xl items-center justify-between py-2'>
				<div
					className='cursor-pointer font-bold'
					onClick={() => navigate('/')}>
					Shortener
				</div>
				<div className='flex items-center gap-2'>
					{getShorteners && (
						<CreateShortener getShorteners={getShorteners} />
					)}
					<ModeToggle />
				</div>
			</div>
		</div>
	)
}
const CreateShortener = ({
	getShorteners,
}: {
	getShorteners: () => Promise<void>
}) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [link, setLink] = useState<string>('')
	const [error, setError] = useState<string>('')
	const addShortener = async () => {
		setError('')
		await fetch(backend_url + '/link', {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				link: link.startsWith('https://') ? link : 'https://' + link,
			}),
		}).then((response) => {
			if (response.status === 400) {
				setError('Invalid Url')
				return
			}
			getShorteners()
			setLink('')
			setIsOpen(false)
		})
	}
	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline'>Add Shortener</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Add Shortener</DialogTitle>
					<DialogDescription>
						Create a new shortener for your link.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label
							htmlFor='url'
							className='text-left'>
							Url
						</Label>
						<Input
							id='url'
							value={link}
							placeholder='Enter Url'
							required
							className='col-span-3'
							onChange={(e) => setLink(e.target.value)}
						/>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label
							htmlFor='url'
							className='text-left'></Label>
						<div className='col-span-3 text-red-500'>{error}</div>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={addShortener}>Add</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

const ShortenerTable = ({
	shorteners,
	isLoading,
}: {
	shorteners: Shortener[]
	isLoading: boolean
}) => {
	const { toast } = useToast()
	const copyLinkToClipboard = async (code: string) => {
		await navigator.clipboard.writeText(backend_url + '/' + code)
		toast({
			title: 'Link Copied',
			description: `Copied ${backend_url + '/' + code} To Clipboard`,
		})
	}
	const navigate = useNavigate()
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex gap-2'>
					<div>Shorteners</div>
					{isLoading && <Loader2 className='animate-spin'></Loader2>}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					{!shorteners.length && (
						<TableCaption>No Shorteners</TableCaption>
					)}
					<TableHeader>
						<TableRow>
							<TableHead>Link</TableHead>
							<TableHead>Shortener</TableHead>
							<TableHead className='text-right'>
								Visitors
							</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{shorteners.length ? (
							shorteners.map((shortener) => (
								<TableRow key={shortener.id}>
									<TableCell>{shortener.link}</TableCell>
									<TableCell
										className='cursor-pointer select-none'
										onClick={() =>
											copyLinkToClipboard(shortener.code)
										}>
										<div className='flex justify-between gap-4 rounded bg-secondary/70 p-2'>
											{shortener.code}
											<Copy className='h-[1.2rem] w-[1.2rem]' />
										</div>
									</TableCell>
									<TableCell className='text-right'>
										{shortener.visitor_count}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant='ghost'
													className='h-8 w-8 p-0'>
													<span className='sr-only'>
														Open menu
													</span>
													<MoreHorizontal className='h-4 w-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												<DropdownMenuLabel>
													Actions
												</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => {
														navigate(
															'/dashboard/' +
																shortener.code
														)
													}}>
													<Settings className='mr-2 h-4 w-4' />
													View Details
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>{' '}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow></TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
