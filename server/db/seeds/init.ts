import { db } from '../index'

export default async () => {
	await db.$connect()
	await db.role.create({
		data: {
			name: 'مدیریت',
			slug: 'admin',
			perms: [
				{
					'name': 'داشبورد',
					'slug': 'dashboard'
				},
				{
					'name': 'کاربران',
					'slug': 'users'
				},
				{
					'name': 'مدیریت کاربران',
					'slug': 'users.manage'
				},
				{
					'name': 'مدیریت نقش ها',
					'slug': 'users.roles'
				},
				{
					'name': 'گزارشات',
					'slug': 'reports'
				},
				{
					'name': 'وضعیت اماکن',
					'slug': 'reports.properties'
				},
				{
					'name': 'مالی',
					'slug': 'reports.financial'
				},
				{
					'name': 'مدیریت اماکن',
					'slug': 'properties'
				},
				{
					'name': 'مسکونی داخلی',
					'slug': 'properties.inside'
				},
				{
					'name': 'شهرک خاتم‌الانبیاء',
					'slug': 'properties.khatam'
				},
				{
					'name': 'عواید انتفاعی',
					'slug': 'properties.profitable'
				},
				{
					'name': 'مدیریت قراردادها',
					'slug': 'agreements'
				},
				{
					'name': 'مسکونی داخلی',
					'slug': 'agreements.inside'
				},
				{
					'name': 'شهرک خاتم‌الانبیاء',
					'slug': 'agreements.khatam'
				},
				{
					'name': 'عواید انتفاعی',
					'slug': 'agreements.profitable'
				}
			],
			users: {
				create: [
					{
						code: '2980956872',
						mobile: '09135306411',
						name: 'محمدمهدی ایرانمنش'
					},
					{
						code: '2980143650',
						mobile: '09135412477',
						name: 'محسن اکبری'
					}
				]
			}
		}
	})

	await db.role.create({
		data:
			{
				name: 'مستاجر',
				slug: 'user',
				perms: [
					{
						'name': 'داشبورد کاربر',
						'slug': 'user-dashboard'
					},
					{
						'name': 'سررسید های کاربر',
						'slug': 'user-invoices'
					},
					{
						'name': 'قراردادهای کاربر',
						'slug': 'user-agreements'
					},
					{
						'name': 'پرداخت های کاربر',
						'slug': 'user-payments'
					},
					{
						'name': 'تراکنش های کاربر',
						'slug': 'user-transactions'
					}
				],
				users: {
					create: [
						{
							code: '2981123750',
							mobile: '09135306412',
							name: 'محمدعلی ایرانمنش'
						}
					],
					connect: {
						code: '2980143650'
					}
				}
			}

	})
	await db.$disconnect()
}