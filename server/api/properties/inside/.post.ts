import { db } from "~/server/db";
import { PropertyType } from "@prisma/client";
import { useValidate, schema } from "~/composables/useValidate";
export default defineEventHandler(async (event) => {
	if (!event.context.user.can("properties.inside"))
		throw createError({
			message: "شما مجوز دسترسی به منازل مسکونی داخلی را ندارید",
		});

  const data = await useValidate(event, schema.object({
		name: schema.coerce.string().trim(),
		usage: schema.coerce.string().trim(),
	  type: schema.coerce.string().trim(),
		meterage: schema.coerce.string().trim(),
		hasCounter: schema.coerce.boolean(),
		address: schema.coerce.string().trim(),
		description: schema.coerce.string().trim(),
	}))

	const property = await db.property.create({
		data: {
			...data,
			meterage: parseInt(data.meterage)
		}
	})

	if(!property) throw createError({message: 'خطایی رخ داده است لطفا دوباره تلاش کنید', statusCode: 500})
	console.log(property)
	return {
		message: 'مکان مورد نظر با موفقیت ثبت شد.'
	}
});
