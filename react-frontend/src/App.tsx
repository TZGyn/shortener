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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'

import { Copy, Loader2 } from 'lucide-react'

import { useEffect, useState } from 'react'

const backend_url =
	import.meta.env.VITE_BACKEND_URL ?? 'http://192.168.100.40:3000'

type Shortener = {
	id: number
	link: string
	code: string
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

const Navbar = ({ getShorteners }: { getShorteners: () => Promise<void> }) => {
	return (
		<div className='flex justify-center border-b border-b-border px-2'>
			<div className='flex w-full max-w-6xl items-center justify-between py-2'>
				<div className='font-bold'>Shortener</div>
				<div className='flex items-center gap-2'>
					<CreateShortener getShorteners={getShorteners} />
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
	const addShortener = async () => {
		await fetch(backend_url + '/link', {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				link: link,
			}),
		}).then(() => {
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
