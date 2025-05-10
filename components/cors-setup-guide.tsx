import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Code } from 'lucide-react'

export default function CorsSetupGuide() {
	return (
		<Card className='mt-6'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Code className='h-5 w-5' />
					Firebase CORS Configuration
				</CardTitle>
				<CardDescription>
					Configure CORS for your Firebase Storage bucket
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<Alert>
					<AlertTitle>Important</AlertTitle>
					<AlertDescription>
						Firebase Storage may have CORS issues that prevent uploads from your
						domain
					</AlertDescription>
				</Alert>

				<div className='space-y-2'>
					<h3 className='font-medium'>1. Install Firebase CLI</h3>
					<div className='bg-gray-100 p-3 rounded'>
						<code>npm install -g firebase-tools</code>
					</div>
				</div>

				<div className='space-y-2'>
					<h3 className='font-medium'>2. Login to Firebase</h3>
					<div className='bg-gray-100 p-3 rounded'>
						<code>firebase login</code>
					</div>
				</div>

				<div className='space-y-2'>
					<h3 className='font-medium'>3. Create a cors.json file</h3>
					<div className='rounded-md bg-gray-900 p-4'>
						<pre className='text-sm text-white'>
							<code>{`[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]`}</code>
						</pre>
					</div>
					<p className='text-sm text-gray-600'>
						For production, replace with your actual domain(s)
					</p>
				</div>

				<div className='space-y-2'>
					<h3 className='font-medium'>4. Set CORS configuration</h3>
					<div className='bg-gray-100 p-3 rounded'>
						<code>
							firebase storage:buckets:update --cors=cors.json YOUR_BUCKET_NAME
						</code>
					</div>
					<p className='text-sm text-gray-600'>
						Replace YOUR_BUCKET_NAME with your actual bucket name (e.g.,
						mirtv-upload.appspot.com)
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
