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
import { uploadVideo } from '@/lib/firebase'
import { AlertCircle, CheckCircle, Upload, Loader2, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'

export default function UploadForm() {
	const [folder, setFolder] = useState('')
	const [file, setFile] = useState<File | null>(null)
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [debugInfo, setDebugInfo] = useState('')
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

			// Log file info for debugging
			const fileInfo = `Selected file: ${selectedFile.name}
Type: ${selectedFile.type}
Size: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
			setDebugInfo(fileInfo)
		}
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
		setUploading(true)
		setProgress(0)

		// Add debug info
		setDebugInfo(`Starting upload of ${file.name} to folder ${folder}...`)

		try {
			await uploadVideo(file, folder, progress => {
				setProgress(progress)
				setDebugInfo(
					prev => `${prev}\nUpload progress: ${progress.toFixed(0)}%`
				)
			})

			setSuccess(
				`Video "${file.name}" uploaded successfully to ${folder} folder`
			)
			setFile(null)
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
			setDebugInfo(prev => `${prev}\nUpload completed successfully!`)
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
				<CardTitle>Upload Video</CardTitle>
				<CardDescription>
					Upload videos to different language folders
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className='space-y-6'>
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
						<Label htmlFor='folder'>Select Folder</Label>
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
						<Label htmlFor='video'>Video File</Label>
						<Input
							ref={fileInputRef}
							id='video'
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

					<div className='space-y-2'>
						<div className='flex items-center gap-2'>
							<Info className='h-4 w-4 text-blue-500' />
							<Label htmlFor='debug'>Debug Information</Label>
						</div>
						<Textarea
							id='debug'
							value={debugInfo}
							readOnly
							className='h-32 font-mono text-xs'
						/>
					</div>
				</CardContent>

				<CardFooter>
					<Button
						type='submit'
						className='w-full'
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
