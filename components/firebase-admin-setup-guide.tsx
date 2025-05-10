import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { FileKey } from 'lucide-react'

export default function FirebaseAdminSetupGuide() {
	return (
		<Card className='mt-6 border-green-200 bg-green-50'>
			<CardHeader className='bg-green-100 rounded-t-lg'>
				<CardTitle className='flex items-center gap-2 text-green-800'>
					<FileKey className='h-5 w-5 text-green-600' />
					Firebase Admin SDK Setup (Required for Server Upload)
				</CardTitle>
				<CardDescription className='text-green-700'>
					Follow these steps to set up Firebase Admin SDK for server-side
					uploads
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4 pt-4'>
				<Alert className='border-green-300 bg-green-100'>
					<AlertTitle className='text-green-800'>Important</AlertTitle>
					<AlertDescription className='text-green-700'>
						The server-side upload method requires Firebase Admin SDK
						credentials to work properly
					</AlertDescription>
				</Alert>

				<div className='space-y-2'>
					<h3 className='font-medium text-green-800'>
						1. Generate a new private key
					</h3>
					<ol className='list-decimal pl-5 space-y-2 text-sm text-green-700'>
						<li>
							Go to the{' '}
							<a
								href='https://console.firebase.google.com/'
								target='_blank'
								rel='noopener noreferrer'
								className='text-green-600 underline'
							>
								Firebase Console
							</a>
						</li>
						<li>Select your project</li>
						<li>
							Click on the gear icon (⚙️) next to Project Overview to open
							Project settings
						</li>
						<li>Go to the  tab</li>
						<li>Click Generate new private key button</li>
						<li>Save the JSON file securely</li>
					</ol>
				</div>

				<div className='space-y-2'>
					<h3 className='font-medium text-green-800'>
						2. Add these environment variables to your .env.local file
					</h3>
					<div className='rounded-md bg-green-900 p-4'>
						<pre className='text-sm text-white'>
							<code>{`FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour Private Key Here\\n-----END PRIVATE KEY-----\\n"
FIREBASE_STORAGE_BUCKET=your-storage-bucket.appspot.com`}</code>
						</pre>
					</div>
					<p className='text-sm text-green-700 mt-2'>
						Get these values from the JSON file you downloaded. Make sure to
						include all the newlines (\\n) in the private key.
					</p>
				</div>

				<div className='space-y-2'>
					<h3 className='font-medium text-green-800'>
						3. Install required packages
					</h3>
					<div className='bg-green-100 p-3 rounded'>
						<code className='text-green-800'>
							npm install firebase-admin uuid
						</code>
					</div>
				</div>

				<div className='space-y-2'>
					<h3 className='font-medium text-green-800'>4. Restart your server</h3>
					<p className='text-sm text-green-700'>
						After adding these environment variables, restart your server for
						them to take effect
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
