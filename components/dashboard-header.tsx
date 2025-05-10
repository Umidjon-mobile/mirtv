'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut } from 'lucide-react'

interface DashboardHeaderProps {
	user: {
		name?: string | null
		email?: string | null
		image?: string | null
	}
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
	return (
		<header className='bg-white border-b border-gray-200 sticky top-0 left-0 z-50 '>
			<div className='container mx-auto px-4 py-3 flex justify-between items-center'>
				<div className='flex items-center'>
					<h2 className='text-xl font-bold'>Video Admin</h2>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='flex items-center gap-2'>
							<User className='h-5 w-5' />
							<span>{user?.email}</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem
							onClick={() => signOut({ callbackUrl: '/login' })}
						>
							<LogOut className='h-4 w-4 mr-2' />
							<span>Logout</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}
