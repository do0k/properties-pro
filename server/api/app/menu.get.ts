export default defineEventHandler((event) => {
	const allMenu = [
		{
			label: "پیشخوان",
			icon: "teenyicons:imac-outline",
			route: { name: "admin" },
			perm: "dashboard",
		},
		{
			label: "کاربران",
			icon: "teenyicons:users-outline",
			items: [
				{
					label: "مدیریت کاربران",
					icon: "teenyicons:users-outline",
					route: { name: "admin-users" },
					perm: "users.manage",
				},
				{
					label: "مدیریت نقش ها",
					icon: "teenyicons:shield-tick-outline",
					route: { name: "admin-users-roles" },
					perm: "users.roles",
				},
			],
			perm: "users",
		},
		{
			label: "گزارشات",
			icon: "teenyicons:area-chart-outline",
			items: [
				{
					label: "وضعیت اماکن",
					icon: "teenyicons:home-outline",
					route: { name: "admin-reports-properties" },
					perm: "reports.properties"
				},
				{
					label: "مالی",
					icon: "teenyicons:dollar-outline",
					route: { name: "admin-reports-financial" },
					perm: "reports.financial"
				},
			],
			perm: "reports",
		},
		{
			label: "مدیریت اماکن",
			icon: "teenyicons:home-outline",
			items: [
				{
					label: "مسکونی داخلی",
					icon: "teenyicons:home-outline",
					route: { name: "admin-properties-inside" },
					perm: "properties.inside"
				},
				{
					label: "شهرک خاتم‌الانبیاء",
					icon: "teenyicons:home-outline",
					route: { name: "admin-properties-khatam" },
					perm: "properties.khatam"
				},
				{
					label: "اماکن انتفاعی",
					icon: "teenyicons:shop-outline",
					route: { name: "admin-properties-profitable" },
					perm: "properties.profitable"
				},
			],
			perm: "properties"
		},
		{
			label: "مدیریت قراردادها",
			icon: "teenyicons:documents-outline",
			items: [
				{
					label: "مسکونی داخلی",
					icon: "teenyicons:text-document-outline",
					route: { name: "admin-agreements-inside" },
					perm: 'agreements.inside'
				},
				{
					label: "شهرک خاتم‌الانبیاء",
					icon: "teenyicons:text-document-outline",
					route: { name: "admin-agreements-khatam" },
					perm: 'agreements.khatam'
				},
				{
					label: "اماکن انتفاعی",
					icon: "teenyicons:text-document-outline",
					route: { name: "admin-agreements-profitable" },
					perm: 'agreements.profitable'
				},
			],
			perm: 'agreements'
		},
	];

	if (event.context.user.role.toLowerCase() === 'user') {
		return [
			{
				label: "پیشخوان",
				icon: "teenyicons:imac-outline",
				route: { name: "index" },
				perm: "userdashboard",
			},
		]
	} else {
		let userMenu = []
		for (const item of allMenu) {
			const allowed = allowedMenu(item, event.context.user.can)
			if (allowed) {
				userMenu.push(allowed)
			}
		}
		return userMenu
	}
});

const allowedMenu = ({items, ...item}, can:(perm:string)=>boolean) => {
	if ( can(item.perm) ){
		if(items && items.length > 0) {
			const _items = []
			for(const _item of items) {
				const _allowed = allowedMenu(_item, can)
				if (_allowed) {
					_items.push(_allowed)
				}
			}
			return {
				...item,
				items: _items
			}
		} else {
			return item
		}
	}
}