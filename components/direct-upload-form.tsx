'use client'

import type React from 'react'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
	AlertCircle,
	CheckCircle,
	Upload,
	Loader2,
	Info,
	Copy,
	ExternalLink,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import Error from 'next/error'

export default function DirectUploadForm() {
	const [folder, setFolder] = useState('')
	const [file, setFile] = useState<File | null>(null)
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [debugInfo, setDebugInfo] = useState('')
	const [downloadURL, setDownloadURL] = useState('')
	const [copied, setCopied] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0]

			// Check if file is a video
			if (!selectedFile.type.startsWith('video/')) {
				setError('Please select a video file')
				setFile(null)
				e.target.value = ''
				return
			}

			setFile(selectedFile)
			setError('')
			setDownloadURL('')

			// Log file info for debugging
			const fileInfo = `Selected file: ${selectedFile.name}
Type: ${selectedFile.type}
Size: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
			setDebugInfo(fileInfo)
		}
	}

	const copyToClipboard = () => {
		navigator.clipboard.writeText(downloadURL)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!folder) {
			setError('Please select a folder')
			return
		}

		if (!file) {
			setError('Please select a file to upload')
			return
		}

		setError('')
		setSuccess('')
		setDownloadURL('')
		setUploading(true)
		setProgress(0)

		// Add debug info
		setDebugInfo(
			`Starting server-side upload of ${file.name} to folder ${folder}...`
		)

		try {
			// Create a FormData object
			const formData = new FormData()
			formData.append('file', file)
			formData.append('folder', folder)

			// Use the fetch API to upload directly to our server endpoint
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			})

			// Update progress (simulated since fetch doesn't provide progress)
			const updateProgress = () => {
				setProgress(prev => {
					if (prev < 90) {
						const newProgress = prev + 10
						setDebugInfo(
							prevInfo => `${prevInfo}\nUpload progress: ${newProgress}%`
						)
						return newProgress
					}
					return prev
				})
			}

			// Simulate progress updates
			const progressInterval = setInterval(updateProgress, 500)

			if (!response.ok) {
				clearInterval(progressInterval)
				const errorData = await response.json()
				throw new Error(errorData.error || 'Upload failed')
			}

			// Final progress update
			clearInterval(progressInterval)
			setProgress(100)
			setDebugInfo(prev => `${prev}\nUpload progress: 100%`)

			const data = await response.json()
			setSuccess(
				`Video "${file.name}" uploaded successfully to ${folder} folder`
			)
			setDownloadURL(data.downloadURL || '')
			setDebugInfo(
				prev =>
					`${prev}\nUpload completed successfully!\nDownload URL: ${
						data.downloadURL || 'N/A'
					}`
			)

			setFile(null)
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		} catch (error) {
			setError('Error uploading video. Please try again.')
			console.error('Upload error:', error)
			setDebugInfo(prev => `${prev}\nError: ${error || JSON.stringify(error)}`)
		} finally {
			setUploading(false)
		}
	}

	return (
		<Card className='w-full max-w-3xl mx-auto'>
			<CardHeader>
				<CardTitle className='text-green-600'>Server-Side Upload</CardTitle>
				<CardDescription>
					This method uses the server to upload files, bypassing client-side
					restrictions
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className='space-y-6'>
					<Alert className='bg-green-50 border-green-200'>
						<CheckCircle className='h-4 w-4 text-green-500' />
						<AlertTitle>Recommended Method</AlertTitle>
						<AlertDescription>
							This server-side upload method is more reliable and bypasses
							client-side Firebase restrictions.
						</AlertDescription>
					</Alert>

					{error && (
						<Alert variant='destructive'>
							<AlertCircle className='h-4 w-4' />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{success && (
						<Alert
							variant='destructive'
							className='bg-green-50 border-green-200 text-green-800'
						>
							<CheckCircle className='h-4 w-4 text-green-500' />
							<AlertTitle>Success</AlertTitle>
							<AlertDescription>{success}</AlertDescription>
						</Alert>
					)}

					<div className='space-y-2'>
						<Label htmlFor='direct-folder'>Select Folder</Label>
						<Select value={folder} onValueChange={setFolder}>
							<SelectTrigger id='direct-folder'>
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
						<Label htmlFor='direct-video'>Video File</Label>
						<Input
							ref={fileInputRef}
							id='direct-video'
							type='file'
							accept='video/*'
							onChange={handleFileChange}
							disabled={uploading}
						/>
						{file && (
							<p className='text-sm text-gray-500'>
								Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}{' '}
								MB)
							</p>
						)}
					</div>

					{uploading && (
						<div className='space-y-2'>
							<div className='flex justify-between text-sm'>
								<span>Uploading...</span>
								<span>{progress.toFixed(0)}%</span>
							</div>
							<Progress value={progress} className='h-2' />
						</div>
					)}

					{downloadURL && (
						<div className='space-y-2 p-4 border rounded-md bg-gray-50'>
							<Label className='font-medium'>Video URL:</Label>
							<div className='flex items-center gap-2 mt-1'>
								<Input value={downloadURL} readOnly className='flex-1' />
								<Button
									type='button'
									size='sm'
									variant='outline'
									onClick={copyToClipboard}
								>
									{copied ? (
										<CheckCircle className='h-4 w-4' />
									) : (
										<Copy className='h-4 w-4' />
									)}
								</Button>
								<Button
									type='button'
									size='sm'
									variant='outline'
									onClick={() => window.open(downloadURL, '_blank')}
								>
									<ExternalLink className='h-4 w-4' />
								</Button>
							</div>
						</div>
					)}

					<div className='space-y-2'>
						<div className='flex items-center gap-2'>
							<Info className='h-4 w-4 text-blue-500' />
							<Label htmlFor='direct-debug'>Debug Information</Label>
						</div>
						<Textarea
							id='direct-debug'
							value={debugInfo}
							readOnly
							className='h-32 font-mono text-xs'
						/>
					</div>
				</CardContent>

				<CardFooter>
					<Button
						type='submit'
						className='w-full bg-green-600 hover:bg-green-700'
						disabled={uploading || !file || !folder}
					>
						{uploading ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Uploading...
							</>
						) : (
							<>
								<Upload className='mr-2 h-4 w-4' />
								Upload Video
							</>
						)}
					</Button>
				</CardFooter>
			</form>
		</Card>
	)
}
