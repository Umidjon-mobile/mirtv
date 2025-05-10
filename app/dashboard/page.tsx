import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardHeader from '@/components/dashboard-header'
import DirectUploadForm from '@/components/direct-upload-form'
import VideoList from '@/components/video-list'
import FirebaseRulesGuide from '@/components/firebase-rules-guide'
import FirebaseConfigChecker from '@/components/firebase-config-checker'
import PublicUrlGenerator from '@/components/public-url-generator'
import CorsTroubleshooter from '@/components/cors-troubleshooter'
import VideoDirectLink from '@/components/video-direct-link'

export default async function DashboardPage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<DashboardHeader user={session.user ?? {}} />
			<main className='container mx-auto py-6 px-4'>
				<h1 className='text-3xl font-bold mb-6'>Video Upload Dashboard</h1>
				<FirebaseConfigChecker />

				<div className='grid grid-cols-1 gap-8 mt-6'>
					<FirebaseRulesGuide />
					<VideoDirectLink />
					<DirectUploadForm />
					<VideoList />
					<PublicUrlGenerator />
					<CorsTroubleshooter />
				</div>
			</main>
		</div>
	)
}
