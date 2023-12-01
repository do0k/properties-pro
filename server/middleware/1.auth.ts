import { getServerSession } from "#auth";
import { db } from '~/server/db'

export default defineEventHandler(async (event) => {
	if (
		!event.node.req.url?.startsWith("/api") ||
		event.node.req.url?.startsWith("/api/auth") ||
		event.node.req.url?.startsWith("/api/otp") ||
		event.node.req.url?.startsWith("/api/cron")
	) {
		return;
	}
	const session = await getServerSession(event);
	if (!session) {
		throw createError({ statusCode: 403, message: "عدم دسترسی به محتوا" });
	}
});
