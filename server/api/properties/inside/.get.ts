import {db} from '~/server/db'

export default defineEventHandler(async (event) => {
  if(!event.context.user.can('properties.inside')) throw createError({
    message: 'شما مجوز دسترسی به اماکن مسکونی داخلی را ندارید.',
    statusCode: 403
  })

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

	if (_filters.meterage) {
		where.meterage = parseInt(_filters.meterage);
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
		db.property.count({
			where: {
				...where,
			},
		}),
		db.property.findMany({
			where: {
				...where,
			},
			orderBy: { ...orderedBy },
			include: {
				agreements: {
					include: {
						user: true
					}
				}
			},
			skip: (parseInt(page) - 1) * parseInt(size),
			take: parseInt(size),
		}),
	]);
	await db.$disconnect();
	return { total, items };
})