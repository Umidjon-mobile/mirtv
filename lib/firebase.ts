import { initializeApp } from 'firebase/app'
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from 'firebase/storage'

// Your Firebase configuration
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket:
		process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
		'mirtv-upload.firebasestorage.app', // Hardcoded fallback
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Storage with explicit bucket URL
const storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`)

export async function uploadVideo(
	file: File,
	folder: string,
	onProgress: (progress: number) => void
): Promise<string> {
	return new Promise(async (resolve, reject) => {
		try {
			// Create a unique filename to avoid conflicts
			const timestamp = new Date().getTime()
			const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
			const uniqueFilename = `${timestamp}_${safeFileName}`

			// Create a storage reference with explicit bucket
			const storageRef = ref(storage, `${folder}/${uniqueFilename}`)
			console.log('Uploading to path:', `${folder}/${uniqueFilename}`)
			console.log('Storage reference:', storageRef.fullPath)

			// Create the upload task
			const uploadTask = uploadBytesResumable(storageRef, file)

			// Register three observers:
			uploadTask.on(
				'state_changed',
				snapshot => {
					// Observe state change events such as progress
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					onProgress(progress)
					console.log('Upload progress:', progress)
				},
				error => {
					// Handle unsuccessful uploads
					console.error('Upload error:', error)
					reject(error)
				},
				async () => {
					// Handle successful uploads on complete
					const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
					console.log('Upload successful, download URL:', downloadURL)
					resolve(downloadURL)
				}
			)
		} catch (error) {
			console.error('Storage error:', error)
			reject(error)
		}
	})
}

// Function to verify Firebase configuration
export function verifyFirebaseConfig() {
	return {
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
		authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
			? '✓ Set'
			: '✗ Missing',
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
			? '✓ Set'
			: '✗ Missing',
		storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
			? '✓ Set'
			: '✗ Missing',
		messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
			? '✓ Set'
			: '✗ Missing',
		appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing',
	}
}
