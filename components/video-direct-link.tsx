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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function VideoDirectLink() {
	const [videoUrl, setVideoUrl] = useState('')
	const [copied, setCopied] = useState(false)
	const [testResult, setTestResult] = useState<{
		success: boolean
		message: string
	} | null>(null)

	const copyToClipboard = () => {
		navigator.clipboard.writeText(videoUrl)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const testUrl = async () => {
		try {
			setTestResult(null)

			// Simple check if URL is valid
			if (!videoUrl || !videoUrl.startsWith('http')) {
				setTestResult({
					success: false,
					message: 'Please enter a valid URL',
				})
				return
			}

			// Try to fetch the URL to see if it's accessible
			const response = await fetch(videoUrl, { method: 'HEAD' })

			if (response.ok) {
				setTestResult({
					success: true,
					message: 'Success! The video URL is accessible.',
				})
			} else {
				setTestResult({
					success: false,
					message: `Error: ${response.status} ${response.statusText}`,
				})
			}
		} catch {
			setTestResult({
				success: false,
				message:
					'Error: Could not access the URL. This might be due to CORS restrictions.',
			})
		}
	}

	return (
		<Card className='mt-6'>
			<CardHeader>
				<CardTitle>Test Video URL</CardTitle>
				<CardDescription>
					Test if your video URL is publicly accessible
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='video-url'>Video URL</Label>
					<Input
						id='video-url'
						value={videoUrl}
						onChange={e => setVideoUrl(e.target.value)}
						placeholder='https://firebasestorage.googleapis.com/v0/b/...'
					/>
				</div>

				<div className='flex gap-2'>
					<Button onClick={testUrl} className='flex-1'>
						Test URL
					</Button>
					<Button
						variant='outline'
						onClick={copyToClipboard}
						disabled={!videoUrl}
					>
						{copied ? (
							<CheckCircle className='h-4 w-4 mr-2' />
						) : (
							<Copy className='h-4 w-4 mr-2' />
						)}
						Copy
					</Button>
					<Button
						variant='outline'
						onClick={() => window.open(videoUrl, '_blank')}
						disabled={!videoUrl}
					>
						<ExternalLink className='h-4 w-4' />
					</Button>
				</div>

				{testResult && (
					<Alert
						variant={testResult.success ? 'destructive' : 'destructive'}
						className={testResult.success ? 'bg-green-50 border-green-200' : ''}
					>
						<AlertTitle>{testResult.success ? 'Success' : 'Error'}</AlertTitle>
						<AlertDescription>{testResult.message}</AlertDescription>
					</Alert>
				)}

				<div className='p-4 bg-gray-50 border rounded-md'>
					<h3 className='font-medium mb-2'>Video Player Test</h3>
					{videoUrl ? (
						<video
							controls
							className='w-full rounded-md'
							style={{ maxHeight: '300px' }}
						>
							<source src={videoUrl} type='video/mp4' />
							Your browser does not support the video tag.
						</video>
					) : (
						<div className='text-center py-10 text-gray-500 bg-gray-100 rounded-md'>
							Enter a video URL above to test playback
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
