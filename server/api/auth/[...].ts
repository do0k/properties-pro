// import type { AuthConfig } from "@auth/core/types";
import { NuxtAuthHandler } from "#auth";
// import Credentials from "@auth/core/providers/credentials";
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from "~/server/db";

export default NuxtAuthHandler({
	secret: useRuntimeConfig().authSecret,
	providers: [
		// @ts-expect-error
		CredentialsProvider.default({
			name: "credentials",
			credentials: {},
			authorize: async (credentials: { otp: string; code: string }) => {
				try {
					const user = await db.user.findUnique({
						where: { code: String(credentials.code) },
					});
					if (!user)
						throw createError({
							message: "کاربر با کدملی وارد شده وجود ندارد",
							statusCode: 404,
						});
					if (user && (!user.expire || new Date(user.expire) < new Date()))
						throw createError({
							message: "کدتایید وارد شده اشتباه است و یا منقضی شده است",
							statusCode: 422,
						});
					if (user) {
						const auth = user.otp === String(credentials.otp);
						if (auth) {
							return {
								id: user.id,
								name: user
							};
						}
					}
				} catch (e) {
					throw createError({
						message: "مقادیر ورودی اشتباه است یا وارد نشده است",
						statusCode: 422,
					});
				}
				return null;
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		redirect: ({ url, baseUrl }) => {
		  let _URL = baseUrl
		  if (url.startsWith('/')) { _URL = `${baseUrl}${url}` } else if (new URL(url).origin === baseUrl) { _URL = url }
		  return _URL
		},
		jwt: ({ token, user, account }) => {
			if (user) {
				token = {
					...token,
					...user,
				};
			}
			return token;
		},
		session: ({ session, token }) => {
			session.user = {
				...token,
				...session.user,
			};
			return session;
		},
	},
	pages: {
		signIn: "/auth/login",
		error: "/auth/login",
	},
})