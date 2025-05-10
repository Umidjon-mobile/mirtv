import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { hash } from 'bcryptjs'

export async function GET() {
	try {
		const { db } = await connectToDatabase()

		// Check if admin user already exists
		const existingUser = await db
			.collection('users')
			.findOne({ email: 'admin@example.com' })

		if (existingUser) {
			return NextResponse.json({ message: 'Admin user already exists' })
		}

		// Create admin user
		const hashedPassword = await hash('admin123', 10)

		await db.collection('users').insertOne({
			name: 'Admin User',
			email: 'admin@example.com',
			password: hashedPassword,
			role: 'admin',
			createdAt: new Date(),
		})

		return NextResponse.json({ message: 'Admin user created successfully' })
	} catch (error) {
		console.error('Seed error:', error)
		return NextResponse.json(
			{ error: 'Failed to seed database' },
			{ status: 500 }
		)
	}
}
