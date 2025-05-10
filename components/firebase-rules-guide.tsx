import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function FirebaseRulesGuide() {
	return (
		<Card className='mt-6 border-red-200'>
			<CardHeader className='bg-red-50'>
				<CardTitle className='flex items-center gap-2 text-red-800'>
					<AlertTriangle className='h-5 w-5 text-red-600' />
					Fix Firebase Storage Permission Denied Error
				</CardTitle>
				<CardDescription className='text-red-700'>
					Follow these exact steps to fix the 403 Permission Denied error
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4 pt-4'>
				<Alert variant='destructive'>
					<AlertTitle>Permission Denied Error</AlertTitle>
					<AlertDescription>
						Your current Firebase Storage rules are blocking public access to
						your videos
					</AlertDescription>
				</Alert>

				<div className='space-y-2'>
					<h3 className='font-medium'>Step 1: Go to Firebase Console</h3>
					<ol className='list-decimal pl-5 space-y-2 text-sm'>
						<li>
							Go to the{' '}
							<a
								href='https://console.firebase.google.com/'
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-600 underline'
							>
								Firebase Console
							</a>
						</li>
						<li>Select your project (mirtv-upload)</li>
						<li>Click on Storage in the left sidebar</li>
						<li>Click on the Rules tab</li>
					</ol>
				</div>

				<div className='space-y-2'>
					<h3 className='font-medium'>
						Step 2: Replace your rules with these EXACT rules
					</h3>
					<div className='rounded-md bg-gray-900 p-4'>
						<pre className='text-sm text-white'>
							<code>{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Allow anyone to read any file
      allow read: if true;
      
      // Only allow authenticated users to write
      allow write: if request.auth != null;
    }
  }
}`}</code>
						</pre>
					</div>
					<p className='text-sm text-red-600 font-bold mt-2'>
						Important: Make sure you replace ALL existing rules with exactly
						these rules!
					</p>
				</div>

				<div className='space-y-2'>
					<h3 className='font-medium'>Step 3: Click Publish</h3>
					<p className='text-sm'>
						After replacing the rules, click the Publish button to apply the
						changes
					</p>
					<div className='bg-yellow-50 border border-yellow-200 p-3 rounded-md'>
						<p className='text-sm text-yellow-800'>
							Note: It may take a few minutes for the new rules to take effect.
							If you still get permission denied errors after publishing, wait
							5-10 minutes and try again.
						</p>
					</div>
				</div>

				<div className='space-y-2'>
					<h3 className='font-medium'>Step 4: Test your public URL again</h3>
					<p className='text-sm'>
						After publishing the rules and waiting a few minutes, try accessing
						your video URL again:
					</p>
					<div className='bg-gray-100 p-3 rounded text-xs break-all'>
						https://firebasestorage.googleapis.com/v0/b/mirtv-upload.firebasestorage.app/o/movie-en%2F1746888137944_Sam_Altman__the_CEO_of_OpenAI__made_a_remarkable_decision_when_he.mp4?alt=media
					</div>
				</div>

				<div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md'>
					<h3 className='font-medium text-blue-800'>
						Alternative: Use Signed URLs
					</h3>
					<p className='text-sm text-blue-700 mt-1'>
						If you can&apos;t modify the Firebase rules, you can use the signed
						URLs from our system instead. Signed URLs will work regardless of
						the Firebase rules, but they will expire eventually.
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
