import type React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import NextTopLoader from 'nextjs-toploader'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Mirtv Video Admin Panel',
	description: ' Mirtv  Upload videos to different folders',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<AuthProvider>
					<NextTopLoader showSpinner={false} />
					{children}
				</AuthProvider>
			</body>
		</html>
	)
}
