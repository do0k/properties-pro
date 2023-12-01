export default defineEventHandler(async (event) => {
	if (!event.context.user || event.node.req.url?.startsWith('/api')) return

	if (event.context.user.role.toLowerCase() === 'user') {
		if (event.node.req.url?.startsWith('/admin')) {
			await sendRedirect(event, '/', 302)
		} else {
			return
		}
	} else {
		if (!event.node.req.url?.startsWith('/admin')) {
			await sendRedirect(event, '/admin', 302)
		} else {
			return
		}
	}
})