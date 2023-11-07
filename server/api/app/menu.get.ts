export default defineEventHandler (() => {
  return [
    {
			label: 'داشبورد',
			icon: 'teenyicons:imac-outline',
			route: { name: 'index' },
		},
		{
			label: 'کاربران',
			icon: 'teenyicons:users-outline',
			route: { name: 'users' }
		},
		{
			label: 'گزارشات',
			icon: 'teenyicons:area-chart-outline',
			items: [
				{ label: 'وضعیت اماکن', icon: 'teenyicons:home-outline', route: { name: 'reports-properties' } },
				{ label: 'مالی', icon: 'teenyicons:dollar-outline', route: { name: 'reports-financial' } },
			],
		},
		{
			label: 'مدیریت اماکن',
			icon: 'teenyicons:home-outline',
			items: [
				{ label: 'مسکونی داخلی', icon: 'teenyicons:home-outline', route: { name: 'properties-inside' } },
				{ label: 'شهرک خاتم‌الانبیاء', icon: 'teenyicons:home-outline', route: { name: 'properties-khatam' } },
				{ label: 'اماکن انتفاعی', icon: 'teenyicons:shop-outline', route: { name: 'properties-profitable' } },
			],
		},
		{
			label: 'مدیریت قراردادها',
			icon: 'teenyicons:documents-outline',
			items: [
				{ label: 'مسکونی داخلی', icon: 'teenyicons:text-document-outline', route: { name: 'agreements-inside' } },
				{
					label: 'شهرک خاتم‌الانبیاء',
					icon: 'teenyicons:text-document-outline',
					route: { name: 'agreements-khatam' }
				},
				{ label: 'اماکن انتفاعی', icon: 'teenyicons:text-document-outline', route: { name: 'agreements-profitable' } },
			],
		},
  ]
})