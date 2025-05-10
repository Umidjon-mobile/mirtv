'use client'

import { useState } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, CheckCircle, ExternalLink } from 'lucide-react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

export default function PublicUrlGenerator() {
	const [folder, setFolder] = useState('movie-en')
	const [fileName, setFileName] = useState('')
	const [bucketName, setBucketName] = useState(
		'mirtv-upload.firebasestorage.app'
	)
	const [copied, setCopied] = useState(false)

	const getPublicUrl = () => {
		if (!fileName) return ''

		// Encode the path components
		const encodedFolder = encodeURIComponent(folder)
		const encodedFileName = encodeURIComponent(fileName)

		return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedFolder}%2F${encodedFileName}?alt=media`
	}

	const publicUrl = getPublicUrl()

	const copyToClipboard = () => {
		navigator.clipboard.writeText(publicUrl)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<Card className='mt-6'>
			<CardHeader>
				<CardTitle>Public URL Generator</CardTitle>
				<CardDescription>
					Generate public URLs for your Firebase Storage videos
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='bucket-name'>Firebase Storage Bucket</Label>
					<Input
						id='bucket-name'
						value={bucketName}
						onChange={e => setBucketName(e.target.value)}
						placeholder='your-project-id.firebasestorage.app'
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='folder'>Folder</Label>
					<Select value={folder} onValueChange={setFolder}>
						<SelectTrigger id='folder'>
							<SelectValue placeholder='Select a folder' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='movie-en'>English (movie-en)</SelectItem>
							<SelectItem value='movie-ru'>Russian (movie-ru)</SelectItem>
							<SelectItem value='movie-uz'>Uzbek (movie-uz)</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='file-name'>File Name (with timestamp)</Label>
					<Input
						id='file-name'
						value={fileName}
						onChange={e => setFileName(e.target.value)}
						placeholder='1746887509977_video_file_name.mp4'
					/>
					<p className='text-xs text-gray-500'>
						Example:
						1746887509977_Sam_Altman_the_CEO_of_OpenAI_made_a_remarkable_decision_when_he.mp4
					</p>
				</div>

				{publicUrl && (
					<div className='space-y-2 p-4 border rounded-md bg-gray-50 mt-4'>
						<Label className='font-medium'>Public URL:</Label>
						<div className='flex flex-col gap-2'>
							<Input value={publicUrl} readOnly className='font-mono text-xs' />
							<div className='flex gap-2'>
								<Button
									type='button'
									size='sm'
									variant='outline'
									onClick={copyToClipboard}
									className='flex-1'
								>
									{copied ? (
										<>
											<CheckCircle className='h-4 w-4 mr-2' />
											Copied!
										</>
									) : (
										<>
											<Copy className='h-4 w-4 mr-2' />
											Copy URL
										</>
									)}
								</Button>
								<Button
									type='button'
									size='sm'
									variant='outline'
									onClick={() => window.open(publicUrl, '_blank')}
									disabled={!fileName}
								>
									<ExternalLink className='h-4 w-4 mr-2' />
									Open
								</Button>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
