import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
	if (
		!event.node.req.url?.startsWith("/api") ||
		event.node.req.url?.startsWith("/api/auth") ||
		event.node.req.url?.startsWith("/api/otp")
	) {
		return;
	}
	const session = await getServerSession(event);
	if (!session) {
		throw createError({ statusCode: 403, message: "عدم دسترسی به محتوا" });
	}
});
