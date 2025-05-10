import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
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
		console.log('Firebase Admin initialized successfully')
	} catch {}
}

export async function POST(request: Request) {
	try {
		// Check authentication
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Get form data
		const formData = await request.formData()
		const file = formData.get('file') as File
		const folder = formData.get('folder') as string

		if (!file || !folder) {
			return NextResponse.json(
				{ error: 'File and folder are required' },
				{ status: 400 }
			)
		}

		// Log debug information
		console.log('Server upload request received:', {
			fileName: file.name,
			fileType: file.type,
			fileSize: file.size,
			folder,
		})

		// Create a unique filename
		const timestamp = new Date().getTime()
		const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
		const uniqueFilename = `${timestamp}_${safeFileName}`
		const filePath = `${folder}/${uniqueFilename}`

		// Save file to temporary location
		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)
		const tempFilePath = join('/tmp', uuidv4())
		await writeFile(tempFilePath, buffer)

		console.log('File saved to temporary location:', tempFilePath)

		// Check if Firebase Admin is initialized
		if (!admin.apps.length) {
			return NextResponse.json(
				{ error: 'Firebase Admin SDK not initialized. Check server logs.' },
				{ status: 500 }
			)
		}

		// Upload to Firebase Storage using Admin SDK
		const bucket = admin.storage().bucket()
		console.log('Using storage bucket:', bucket.name)

		await bucket.upload(tempFilePath, {
			destination: filePath,
			metadata: {
				contentType: file.type,
			},
		})

		console.log('File uploaded to Firebase Storage:', filePath)

		// Generate download URL
		const [url] = await bucket.file(filePath).getSignedUrl({
			action: 'read',
			expires: '03-01-2500', // Far future expiration
		})

		console.log('Generated URL:', url)

		return NextResponse.json({
			success: true,
			downloadURL: url,
			filePath,
			fileName: uniqueFilename,
		})
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('Server upload error:', error)
			return NextResponse.json(
				{
					error: error.message || 'Failed to upload file',
					details: error.toString(),
					stack: error.stack,
				},
				{ status: 500 }
			)
		} else {
			console.error('Server upload error:', error)
			return NextResponse.json(
				{
					error: 'An unknown error occurred',
					details: String(error),
				},
				{ status: 500 }
			)
		}
	}
}
