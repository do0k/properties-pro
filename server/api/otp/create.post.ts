import { useSend } from "~/composables/useSend";
import { schema, useValidate } from "~/composables/useValidate";
import { db } from "~/server/db";

export default defineEventHandler(async (event) => {
	const { code, mobile } = await useValidate(
		event,
		schema.object({
			code: schema.coerce.string().trim().min(10).max(10),
			mobile: schema.coerce.string().trim().min(11).max(11),
		})
	);
	const user = await db.user.findUnique({ where: { code } });
	if (!user)
		throw createError({
			message: "کاربری با این کدملی یافت نشد",
			statusCode: 404,
		});
	if (user.mobile !== mobile)
		throw createError({
			message: "شماره موبایل واردشده متعلق به این کدملی نمی باشد",
			statusCode: 404,
		});
	if (new Date(user.expire) > new Date()) {
		return {
			message:
				"لطفا تا درخواست کد بعدی به مدت " +
				Math.floor(
					(new Date(user.expire).getTime() - new Date().getTime()) / 1000
				) +
				" ثانیه صبر کنید.",
			expire: user.expire,
		};
	} else {
		const otp = String(Math.floor(100000 + Math.random() * 900000));
		const userUpdate = await db.user.update({
			where: {
				code,
			},
			data: {
				otp,
				expire: new Date(new Date().getTime() + 2 * 60000),
			},
		});

		const result = await $fetch(
			"http://rest.ippanel.com/v1/messages/patterns/send",
			{
				method: "POST",
				headers: {
					Authorization:
						"AccessKey IWGFJS4AAugLxEdMel22dl3xOt9PNubqmLPJ0CpF3SM=",
				},
				body: {
					pattern_code: "z4avu5wdy824gpq",
					originator: "+983000505",
					recipient: String(user.mobile),
					values: {
						otp,
					},
				},
			}
		);
		if (!result)
			throw createError({ message: "خطا در ارسال کدتایید", statusCode: 500 });
		return {
			message: "کدتایید با موفقیت ارسال شد",
			expire: userUpdate.expire,
		};
	}
});
