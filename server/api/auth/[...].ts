import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";

export default NuxtAuthHandler({
	secret: useRuntimeConfig().authSecret,
	providers: [
		// @ts-expect-errors
		CredentialsProvider.default({
			name: "otp-auth",
			credentials: {
				code: { label: "کدملی", type: "text" },
				otp: { label: "کدتایید", type: "text" },
			},
			authorize: async (credentials: { code: string; otp: string }) => {
				try {
					const user = await db.user.findUnique({ where: { code: credentials.code } });
					console.log(user)
					if (!user)
						throw createError({
							message: "کاربر با کدملی وارد شده وجود ندارد",
							statusCode: 404,
						});
					if (user && (!user.expire || new Date(user.expire) < new Date()))
					console.log('error date')
						throw createError({
							message: "کدتایید وارد شده اشتباه است و یا منقضی شده است",
							statusCode: 422,
						});
					if (user) {
						console.log('user')
						const auth = user.otp === credentials.otp;
						if (auth) {
							console.log('auth')
							delete user.otp;
							delete user.expire;
							return {
								id: user.id,
								name: user,
							};
						}
					}
				} catch (e) {
					console.log('error')
					throw createError({ message: 'مقادیر ورودی اشتباه است یا وارد نشده است', statusCode: 422 })
				}
				return null
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		signIn: ({ user }) => {
      return !!user
    },
    redirect: ({ url, baseUrl }) => {
      let _URL = baseUrl
      if (url.startsWith('/')) { _URL = `${baseUrl}${url}` } else if (new URL(url).origin === baseUrl) { _URL = url }
      return _URL
    },
    jwt: (req) => {
      return req.token
    },
    session: (req) => {
      return req.session
    }
	},
	pages: {
		signIn: "/auth/login",
		error: "/auth/login",
	},
});
