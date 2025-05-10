import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
	try {
		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: process.env.FIREBASE_PROJECT_ID,
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
				privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
			}),
			storageBucket:
				process.env.FIREBASE_STORAGE_BUCKET ||
				process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
		})
		console.log('Firebase Admin initialized successfully in videos API')
	} catch {}
}

export async function GET() {
	try {
		// Check authentication
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Get the bucket
		const bucket = admin.storage().bucket()
		const bucketName = bucket.name

		// Get all files in the bucket
		const [files] = await bucket.getFiles()

		// Process files to get URLs and organize by folder
		const videos = await Promise.all(
			files
				.filter(
					file =>
						file.name.endsWith('.mp4') ||
						file.name.endsWith('.mov') ||
						file.name.endsWith('.avi')
				)
				.map(async file => {
					// Generate both signed URL and public URL
					const [signedUrl] = await file.getSignedUrl({
						action: 'read',
						expires: '03-01-2500', // Far future expiration
					})

					// Create public URL format
					const pathParts = file.name.split('/')
					const folder = pathParts.length > 1 ? pathParts[0] : 'root'
					const name = pathParts[pathParts.length - 1]

					// Public URL format
					const encodedPath = encodeURIComponent(file.name).replace(/%2F/g, '/')
					const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath.replace(
						/\//g,
						'%2F'
					)}?alt=media`

					// Get file metadata
					const [metadata] = await file.getMetadata()

					return {
						name,
						folder,
						url: signedUrl,
						publicUrl,
						createdAt: metadata.timeCreated || new Date().toISOString(),
					}
				})
		)

		return NextResponse.json({ videos })
	} catch {}
}

export async function DELETE(request: Request) {
	try {
		// Check authentication
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Get request body
		const body = await request.json()
		const { name, folder } = body

		if (!name) {
			return NextResponse.json(
				{ error: 'File name is required' },
				{ status: 400 }
			)
		}

		// Construct the file path
		const filePath = folder ? `${folder}/${name}` : name

		// Get the bucket
		const bucket = admin.storage().bucket()

		// Delete the file
		await bucket.file(filePath).delete()

		return NextResponse.json({ success: true })
	} catch {}
}
