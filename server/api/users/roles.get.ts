import { db } from "~/server/db";
import { Prisma } from "@prisma/client";
import type { Filters } from "~/types";

export default defineEventHandler(async (event) => {
	if (!event.context.user.can("users")) {
		throw createError({
			statusCode: 403,
			message: "شما مجوز دسترسی به کاربران را ندارید",
		});
	}
	const { page, size, order, orderBy, filters } = getQuery(event) as {
		page: string;
		size: string;
		order: string;
		orderBy: string;
		filters: string;
	};

	const _filters: Filters = JSON.parse(filters);
	const where: any = {};
	if (_filters.id) {
		where.id = parseInt(_filters.id);
	}

  if (_filters.name) {
		where.name = parseInt(_filters.name);
	}
	
	let orderedBy: object = {
		id: "asc",
	};
	if (order && orderBy && order !== "" && orderBy !== "") {
		orderedBy = {
			[orderBy]: order,
		};
	}
	const [total, items] = await db.$transaction([
		db.role.count({
			where: {
				...where,
			},
		}),
		db.role.findMany({
			where: {
				...where,
			},
			orderBy: { ...orderedBy },
			skip: (parseInt(page) - 1) * parseInt(size),
			take: parseInt(size),
		}),
	]);
	await db.$disconnect();
	return { total, items };
});
