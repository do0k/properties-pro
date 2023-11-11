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
		where.name = _filters.name;
	}

	if (_filters.mobile) {
		where.mobile = _filters.mobile;
	}

	if (_filters.code) {
		where.code = _filters.code;
	}

	if (_filters.role) {
		where.role = {
			is: {
				slug: _filters.role
			}
		}
	}

	if (_filters.createdAt) {
		let start = new Date(_filters.createdAt);
		let end = new Date(_filters.createdAt);
		start.setHours(0, 0, 0, 0);
		end.setHours(23, 59, 59, 999);
		where.createdAt = {
			lte: end,
			gte: start,
		};
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
		db.user.count({
			where: {
				...where,
			},
		}),
		db.user.findMany({
			where: {
				...where,
			},
			orderBy: { ...orderedBy },
			include: {
        role: true
			},
			skip: (parseInt(page) - 1) * parseInt(size),
			take: parseInt(size),
		}),
	]);
	await db.$disconnect();
	return { total, items };
});
