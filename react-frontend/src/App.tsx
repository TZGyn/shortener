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
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useEffect, useState } from 'react'

const backend_url = 'http://192.168.100.40:1234'

type Shortener = {
	id: number
	link: string
	code: string
}

export default function App() {
	const [shorteners, setShorteners] = useState<Shortener[]>([])

	const getShorteners = async () => {
		const response = await fetch(backend_url + '/link', {
			method: 'GET',
		})

		const data = (await response.json()).shorteners as Shortener[]

		setShorteners(data)
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
			<div className='mx-auto mt-8 w-full max-w-6xl'>
				<ShortenerTable shorteners={shorteners} />
			</div>
		</ThemeProvider>
	)
}

const Navbar = ({ getShorteners }: { getShorteners: () => Promise<void> }) => {
	return (
		<div className='flex justify-center border-b border-b-border'>
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
		})
	}
	return (
		<Dialog>
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

const ShortenerTable = ({ shorteners }: { shorteners: Shortener[] }) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Link</TableHead>
					<TableHead>Shortener</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{shorteners.map((shortener) => (
					<TableRow key={shortener.id}>
						<TableCell>{shortener.link}</TableCell>
						<TableCell>{shortener.code}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
