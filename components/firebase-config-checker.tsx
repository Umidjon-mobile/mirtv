'use client'

import { useEffect, useState } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { verifyFirebaseConfig } from '@/lib/firebase'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function FirebaseConfigChecker() {
	const [config, setConfig] = useState<Record<string, string>>({})
	const [isConfigValid, setIsConfigValid] = useState(false)

	useEffect(() => {
		const configStatus = verifyFirebaseConfig()
		setConfig(configStatus)

		// Check if all config values are set
		const allSet = Object.values(configStatus).every(
			status => status === '✓ Set'
		)
		setIsConfigValid(allSet)
	}, [])

	return (
		<Card className='mt-6'>
			<CardHeader>
				<CardTitle>Firebase Configuration Status</CardTitle>
				<CardDescription>
					Verify your Firebase configuration is set up correctly
				</CardDescription>
			</CardHeader>
			<CardContent>
				{!isConfigValid && (
					<Alert variant='destructive' className='mb-4'>
						<AlertCircle className='h-4 w-4' />
						<AlertTitle>Configuration Error</AlertTitle>
						<AlertDescription>
							Some Firebase configuration values are missing. Please check your
							environment variables.
						</AlertDescription>
					</Alert>
				)}

				{isConfigValid && (
					<Alert className='mb-4 bg-green-50 border-green-200 text-green-800'>
						<CheckCircle className='h-4 w-4 text-green-500' />
						<AlertTitle>Configuration Valid</AlertTitle>
						<AlertDescription>
							All Firebase configuration values are set.
						</AlertDescription>
					</Alert>
				)}

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{Object.entries(config).map(([key, value]) => (
						<div
							key={key}
							className='flex justify-between items-center p-2 border rounded'
						>
							<span className='font-medium'>{key}</span>
							<span
								className={
									value === '✓ Set' ? 'text-green-600' : 'text-red-600'
								}
							>
								{value}
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
