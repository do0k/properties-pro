import { db } from '~/server/db'
import {useValidate, schema} from '~/composables/useValidate'

export default defineEventHandler(async (event) => {
	if (!event.context.user.can('users.roles')) {
		throw createError({message: 'شما مجوز دسترسی به نقش ها را ندارید', statusCode: 403})
	}
	const data = await useValidate(event, schema.object({
		name: schema.coerce.string().trim(),
		slug: schema.coerce.string().trim().toLowerCase(),
		roleId: schema.coerce.number()
	}))
	const role = await db.role.findUnique({
		where: {id: data.roleId},
	})
	const perms = role.perms
	perms.push({
		name: data.name,
		slug: data.slug
	})
	await db.role.update({
		where: {id: role.id},
		data: {
			...role,
			perms
		}
	})
	await db.$disconnect()
	return {message: 'مجوز با موفقیت ثبت شد'}
})