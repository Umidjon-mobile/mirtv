'use client'

import { useState, useEffect } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Copy, Check, ExternalLink, Trash2, Link } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Video {
	name: string
	folder: string
	url: string
	publicUrl: string
	createdAt: string
}

export default function VideoList() {
	const [videos, setVideos] = useState<Video[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [copied, setCopied] = useState<string | null>(null)

	useEffect(() => {
		fetchVideos()
	}, [])

	const fetchVideos = async () => {
		try {
			setLoading(true)
			const response = await fetch('/api/videos')

			if (!response.ok) {
				throw new Error('Failed to fetch videos')
			}

			const data = await response.json()
			setVideos(data.videos)
		} catch (error) {
			console.error('Error fetching videos:', error)
			setError('Failed to load videos. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const copyToClipboard = (url: string) => {
		navigator.clipboard.writeText(url)
		setCopied(url)
		setTimeout(() => setCopied(null), 2000)
	}

	const deleteVideo = async (name: string, folder: string) => {
		if (!confirm('Are you sure you want to delete this video?')) {
			return
		}

		try {
			const response = await fetch('/api/videos', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, folder }),
			})

			if (!response.ok) {
				throw new Error('Failed to delete video')
			}

			// Refresh the video list
			fetchVideos()
		} catch (error) {
			console.error('Error deleting video:', error)
			setError('Failed to delete video. Please try again.')
		}
	}

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Uploaded Videos</CardTitle>
					<CardDescription>
						View and manage your uploaded videos
					</CardDescription>
				</CardHeader>
				<CardContent className='flex justify-center py-8'>
					<Loader2 className='h-8 w-8 animate-spin text-gray-400' />
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Uploaded Videos</CardTitle>
				<CardDescription>View and manage your uploaded videos</CardDescription>
			</CardHeader>
			<CardContent>
				{error && (
					<Alert variant='destructive' className='mb-4'>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{videos.length === 0 ? (
					<div className='text-center py-8 text-gray-500'>
						No videos uploaded yet
					</div>
				) : (
					<div className='space-y-4'>
						{videos?.map(video => (
							<div key={video.url} className='border rounded-md p-4'>
								<div className='flex flex-col gap-4'>
									<div>
										<h3 className='font-medium truncate'>{video.name}</h3>
										<p className='text-sm text-gray-500'>
											Folder: {video.folder}
										</p>
										<p className='text-sm text-gray-500'>
											Uploaded: {new Date(video.createdAt).toLocaleString()}
										</p>
									</div>

									<Tabs defaultValue='public' className='w-full'>
										<TabsList className='grid w-full grid-cols-2'>
											<TabsTrigger value='public'>Public URL</TabsTrigger>
											<TabsTrigger value='signed'>Signed URL</TabsTrigger>
										</TabsList>

										<TabsContent value='public' className='space-y-2'>
											<div className='flex items-center gap-2 mt-2'>
												<input
													type='text'
													value={video.publicUrl}
													readOnly
													className='flex-1 p-2 text-xs font-mono bg-gray-50 border rounded'
												/>
												<Button
													variant='outline'
													size='sm'
													onClick={() => copyToClipboard(video.publicUrl)}
												>
													{copied === video.publicUrl ? (
														<Check className='h-4 w-4' />
													) : (
														<Copy className='h-4 w-4' />
													)}
												</Button>
												<Button
													variant='outline'
													size='sm'
													onClick={() => window.open(video.publicUrl, '_blank')}
												>
													<ExternalLink className='h-4 w-4' />
												</Button>
											</div>
											<p className='text-xs text-green-600 flex items-center'>
												<Link className='h-3 w-3 mr-1' />
												Public URL (works with Firebase rules set to allow
												public read)
											</p>
										</TabsContent>

										<TabsContent value='signed' className='space-y-2'>
											<div className='flex items-center gap-2 mt-2'>
												<input
													type='text'
													value={video.url}
													readOnly
													className='flex-1 p-2 text-xs font-mono bg-gray-50 border rounded'
												/>
												<Button
													variant='outline'
													size='sm'
													onClick={() => copyToClipboard(video.url)}
												>
													{copied === video.url ? (
														<Check className='h-4 w-4' />
													) : (
														<Copy className='h-4 w-4' />
													)}
												</Button>
												<Button
													variant='outline'
													size='sm'
													onClick={() => window.open(video.url, '_blank')}
												>
													<ExternalLink className='h-4 w-4' />
												</Button>
											</div>
											<p className='text-xs text-blue-600 flex items-center'>
												<Link className='h-3 w-3 mr-1' />
												Signed URL (works regardless of Firebase rules)
											</p>
										</TabsContent>
									</Tabs>

									<div className='flex justify-end'>
										<Button
											variant='destructive'
											size='sm'
											onClick={() => deleteVideo(video.name, video.folder)}
										>
											<Trash2 className='h-4 w-4 mr-1' />
											Delete
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
