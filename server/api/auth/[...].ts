import { NuxtAuthHandler } from '#auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NuxtAuthHandler({
	secret: useRuntimeConfig().authSecret,
	providers: [
		// @ts-expect-errors
		CredentialsProvider.default({
			name: 'credentials',
			credentials: {
				code: {label: 'کدملی', type: 'text'},
				otp: {label: 'کدتایید', type: 'text'}
			},
			async authorize(credentials: {
				code: string,
				otp: string
			}) {
				return {}
			}
		})
	],
	session: {
		strategy: 'jwt'
	},
	callbacks: {
		async jwt({ token, user, account }) {
			if (user) {
				token = {
					...token,
					...user
				}
			}
			return token
		},
		async session({session, token}){
			session.user = {
				...token,
				...session.user
			}
			return session
		}
	},
	pages: {
		signIn: '/auth/login',
		error: '/auth/login'
	}
})