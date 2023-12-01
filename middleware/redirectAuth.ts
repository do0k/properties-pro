export default defineNuxtRouteMiddleware((to, from) => {
	const { data, status } = useAuth()
	// if (!event.context.user) return


	console.log('data', data)
	console.log('status', status)


	// if (event.context.user.role.toLowerCase() === 'user') {
	// 	if (event.node.req.url?.startsWith('/admin')) {
	// 		await sendRedirect(event, '/', 302)
	// 	} else {
	// 		return
	// 	}
	// } else {
	// 	if (!event.node.req.url?.startsWith('/admin')) {
	// 		await sendRedirect(event, '/admin', 302)
	// 	} else {
	// 		return
	// 	}
	// }
})