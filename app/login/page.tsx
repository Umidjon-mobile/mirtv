'use client'

import type React from 'react'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		try {
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password,
			})

			if (result?.error) {
				setError('Invalid email or password')
				setIsLoading(false)
				return
			}

			router.push('/dashboard')
		} catch {
			setError('An error occurred during login')
			setIsLoading(false)
		}
	}

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle className='text-2xl text-center'>Admin Login</CardTitle>
					<CardDescription className='text-center'>
						Enter your credentials to access the video admin panel
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className='space-y-4'>
						{error && (
							<Alert variant='destructive'>
								<AlertCircle className='h-4 w-4' />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='admin@example.com'
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading ? 'Logging in...' : 'Login'}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	)
}
