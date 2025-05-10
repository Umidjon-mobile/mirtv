import NextAuth from 'next-auth'
const auth = NextAuth({})

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			name?: string | null
			email?: string | null
			image?: string | null
		}
	}

	interface User {
		id: string
		name?: string | null
		email?: string | null
		image?: string | null
	}
}
