import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Code } from 'lucide-react'

export default function CorsTroubleshooter() {
	return (
		<Card className='mt-6'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Code className='h-5 w-5' />
					CORS Configuration for Firebase Storage
				</CardTitle>
				<CardDescription>
					If you&apos;re still having issues after updating rules, you may need
					to configure CORS
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<Alert>
					<AlertTitle>CORS Issues</AlertTitle>
					<AlertDescription>
						If your videos can be accessed directly in the browser but not
						embedded in your application, you may have CORS issues
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
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Content-Disposition"]
  }
]`}</code>
						</pre>
					</div>
				</div>

				<div className='space-y-2'>
					<h3 className='font-medium'>4. Set CORS configuration</h3>
					<div className='bg-gray-100 p-3 rounded'>
						<code>
							firebase storage:buckets:update --cors=cors.json
							mirtv-upload.appspot.com
						</code>
					</div>
					<p className='text-sm text-gray-600'>
						Replace <code>mirtv-upload.appspot.com</code> with your actual
						bucket name if different
					</p>
				</div>

				<div className='space-y-2'>
					<h3 className='font-medium'>5. Test again after CORS update</h3>
					<p className='text-sm text-gray-600'>
						After updating CORS settings, try accessing your video URLs again
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
