<script lang="ts" setup>
import type { Role } from '@prisma/client'
import { Refresh, Save } from '~/components/icons'
import type { Filters, Loadings } from '~'
import { defineAppForm } from '~/composables/defineAppForm'

const title = ref('کاربران/مدیریت نقش‌ها')
useHead({
	title,
})

const size: Ref<number> = ref(20)
const page: Ref<number> = ref(1)
const order: Ref<string | undefined> = ref()
const lastIndex = ref<number>()
const roleId = ref<number>()
const orderBy: Ref<string> = ref('')
const filters: Ref<Filters> = ref({})
const loadings = reactive<Loadings>({})
const hasFilter = computed(
	() => Object.keys(filters.value).filter((k) => filters.value[k]).length > 0
)
const clearFilters = () => {
	filters.value = {}
}

const { data, error, refresh, pending } = (await useLazyFetch<{
	total: number;
	items: User[];
}>('/api/users/roles', {
	server: false,
	query: {
		page,
		size,
		order,
		orderBy,
		filters,
	},
})) as unknown as {
	data: { items: User[]; total: number };
	error: any;
	refresh: any;
	pending: any;
}

const orders = ref([])
const perms = ref([])
const changeSort = (prop, index) => {
	if (lastIndex.value !== index) {
		orders.value = []
	}
	if (orders.value[index] === 'asc') {
		order.value = 'desc'
		orders.value[index] = 'desc'
	} else {
		order.value = 'asc'
		orders.value[index] = 'asc'
	}
	orderBy.value = prop
	lastIndex.value = index
}
const dialog: Ref<boolean> = ref(false)
const btnLoading: Ref<boolean> = ref(false)
const roles: Ref<{ label: string, value: string }[]> = ref([])
const [ fields, _data, form ] = defineAppForm({
	name: {
		label: 'نام مجوز',
		icon: 'teenyicons:pen-outline',
		rule: [ {
			required: true,
			message: 'لطفا نام مجوز را وارد کنید'
		} ]
	},
	slug: {
		label: 'نامک مجوز',
		icon: 'teenyicons:hashtag-outline',
		rule: [ {
			required: true,
			message: 'لطفا نامک مجوز را وارد کنید'
		} ]
	}
})

const openFormDialog = async (row) => {
	reset()
	perms.value = row.perms
	roleId.value = row.id
	dialog.value = true
}

const addPerm = async () => {
	btnLoading.value = true
	const { data: _data1, err: _err2 } = await useSend('/api/users/roles', {
		method: 'POST',
		body: { ..._data, roleId: roleId.value }
	})
	btnLoading.value = false
	err(_err2)
	if (msg(_data1)) {
		await refresh()
		dialog.value = false
	}
}

const reset = () => {
	if (form.value) {
		form.value.resetFields()
	}
}
</script>

<template lang="pug">
error-observer(:error="error" :refresh="refresh" :pending="pending")
	el-page-header.p-3(icon="" element-loading-text="درحال بارگزاری ...")
		template(#title)
			el-tooltip(content="تازه‌سازی لیست" )
				el-button(
					:loading="pending"
					:icon="Refresh"
					text
					circle,
					@click="() => refresh()")
		template(#content)
			el-skeleton(:loading="pending" animated)
				template(#template)
					el-skeleton-item(style="height: 32px; width: 160px; margin-bottom:-8px")
				.font-bold.text-indigo-800 {{ title }}
		template(#extra)
			el-skeleton(:loading="pending" animated)
				template(#template)
					.flex.gap-4
						el-skeleton-item(style="height: 32px; width: 210px; margin-bottom:-8px")
				//.flex.gap-4
				//	el-button(type="primary" @click="() => console.log('clicked')") افزودن کاربر
				//		template(#icon)
				//			icon(name="teenyicons:layers-outline")
		el-skeleton(:loading="pending" animated)
			template(#template)
				.flex.gap-4.my-2.items-center.h-6(v-for="i in [1,2,3,4,5]" :key="i")
					el-skeleton-item(style="width:80%; height: 24px")
					el-skeleton-item(style="width:100%; height: 24px")
					el-skeleton-item(style="width:160%; height: 24px")
					el-skeleton-item(style="width:180%; height: 24px")
					el-skeleton-item(style="width:180%; height: 24px")
					el-skeleton-item(style="width:180%; height: 24px")
					el-skeleton-item(style="width:120%; height: 24px")
					el-skeleton-item(style="height: 24px")
			el-table(
				ref="table",
				:data="data.items",
				table-layout="auto",
				stripe,
			)
				template(#empty)
					el-empty
				el-table-column(type="selection" width="30" )
				el-table-column(type="index" label="#")
				el-table-column(:resizable="false" width="90" label="کد" prop="id" )
					template(#header="{column, $index}")
						app-table-header(:label="column.label")
							filterable-table-header(v-model="filters.id")
							sortable-table-header(:order="orders[$index]" @click="changeSort(column.property, $index)")
					template(#default="{ row }")
						el-tag.w-full {{ row.id }}
				el-table-column(width="100" label="نقش")
					template(#header="{column}")
						app-table-header(:label="column.label")
							filterable-table-header(v-model="filters.name")
					template(#default="{ row }") {{ row.name }}
				el-table-column(width="100" label="نامک")
					template(#header="{column}")
						app-table-header(:label="column.label")
							filterable-table-header(v-model="filters.slug")
					template(#default="{ row }")
						el-tag.w-full  {{ row.slug }}
				el-table-column(fixed="right" align="right")
					template(#header)
						.flex.w-full.flex-row-reverse.px-3
							el-popconfirm(
								v-if="hasFilter"
								title="آیا از حذف تمامی صافی‌ها اطمینان دارید؟",
								confirm-button-text="حذف"
								cancel-button-text="لغو"
								confirm-button-type="danger"
								icon-color="red"
								:width="300"
								@confirm="clearFilters"
							)
								template(#reference)
									.flex.gap-2.items-center.text-red-400.cursor-pointer
										.relative.w-3
											icon(name="teenyicons:filter-outline" size="15px")
											icon.absolute.right-1.bottom-1.bg-white(name="teenyicons:denied-outline" size="10px")
										.font-bold حذف صافی‌ها
					template(#default="{ row }")
						el-tooltip(effect="dark" placement="right" content="مدیریت مجوزها")
							el-button.ml-2(
								type="danger"
								text
								class="!px-2",
								size="small"
								:loading="loadings[row.id]"
								@click="openFormDialog(row).then()"
							)
								template(#icon)
									icon(name="teenyicons:shield-tick-outline")
				template(v-if="data.items.length > 0", #append )
					.flex.p-2.bg-slate-100
						el-space
						el-pagination(
							v-model:current-page="page",
							v-model:page-size="size"
							small
							background
							:page-sizes="[10, 20, 30, 50, 100]"
							layout="total, prev, pager, next, sizes"
							:total="data?.total || 0")
	el-drawer(v-model="dialog" title="مجوزها" append-to-body :size="450" :close-on-click-modal="false")
		el-table(
			ref="table",
			height="300"
			:data="perms",
			table-layout="fixed",
			stripe,
		).mb-5
			el-table-column(type="index" width="20" label="#")
			el-table-column(width="80" label="نام مجوز" prop="name" )
				template(#header="{column, $index}")
					app-table-header(:label="column.label")
				template(#default="{ row }")
					.w-full.truncate {{ row.name }}
			el-table-column( width="120" label=" نامک مجوز" prop="slug" )
				template(#header="{column, $index}")
					app-table-header(:label="column.label")
				template(#default="{ row }")
					el-tag.w-full.truncate {{ row.slug }}
			el-table-column(align="right")
				template(#default="{ row }")
					el-tooltip(effect="dark" placement="right" content="حذف مجوز")
						el-button.ml-2(
							type="danger"
							text
							class="!px-2",
							size="small"
						)
							template(#icon)
								icon(name="teenyicons:shield-outline")
		el-divider(content-position="left" )
			.text-gray-500.font-light افزودن مجوز
		app-form(v-model="_data" :fields="fields" @ref="_form => form = _form")
		template(#footer)
			el-button(type="success" :icon="Save" :loading="btnLoading" @click="addPerm") افزودن مجوز
</template>
