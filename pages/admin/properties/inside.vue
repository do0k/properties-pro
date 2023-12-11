<script lang="ts" setup>
import type { Property } from "@prisma/client";
import { PropertyType } from "@prisma/client";
import { Refresh, Save, Add } from "~/components/icons";
import type { Filters, Loadings } from "~";
import { defineAppForm } from "~/composables/defineAppForm";

const title = ref("مدیریت اماکن/مسکونی داخلی");
useHead({
	title,
});

const size: Ref<number> = ref(20);
const page: Ref<number> = ref(1);
const order: Ref<string | undefined> = ref();
const lastIndex = ref<number>();
const orderBy: Ref<string> = ref("");
const filters: Ref<Filters> = ref({});
const loadings = reactive<Loadings>({});
const hasFilter = computed(
	() => Object.keys(filters.value).filter((k) => filters.value[k]).length > 0
);
const clearFilters = () => {
	filters.value = {};
};

const { data, error, refresh, pending } = (await useLazyFetch<{
	total: number;
	items: Property[];
}>("/api/properties/inside", {
	server: false,
	query: {
		page,
		size,
		order,
		orderBy,
		filters,
	},
})) as unknown as {
	data: { items: Property[]; total: number };
	error: any;
	refresh: any;
	pending: any;
};

const orders = ref([]);

const changeSort = (prop, index) => {
	if (lastIndex.value !== index) {
		orders.value = [];
	}
	if (orders.value[index] === "asc") {
		order.value = "desc";
		orders.value[index] = "desc";
	} else {
		order.value = "asc";
		orders.value[index] = "asc";
	}
	orderBy.value = prop;
	lastIndex.value = index;
};
const dialog: Ref<boolean> = ref(false);
const btnLoading: Ref<boolean> = ref(false);
const disabled = computed(()=> _data.hasCounter || false)
const [ fields, _data, form ] = defineAppForm({
	name: {
		label: 'عنوان',
		icon: 'teenyicons:pen-outline',
		rule: [ {
			required: true,
			message: 'لطفا عنوان مکان را وارد کنید'
		} ]
	},
	usage: {
		label: 'کاربری',
		icon: 'teenyicons:hashtag-outline',
		rule: [ {
			required: true,
			message: 'لطفا کاربری مکان را وارد کنید'
		} ]
	},
	meterage: {
		label: 'متراژ',
		icon: 'teenyicons:hashtag-outline',
		rule: [ {
			required: true,
			message: 'لطفا متراژ مکان را وارد کنید'
		} ]
	},
	hasCounter: {
		label: 'دارای کنتور',
		type: 'switch',
		value: false,
		rule: [{
			required: true,
			message: 'لطفا وضعیت کنتور را مشخص کنید'
		}]
	},
	address: {
		label: 'آدرس',
		icon: 'teenyicons:hashtag-outline',
		type: 'textarea',
		rule: [ {
			required: true,
			message: 'لطفا آدرس مکان را وارد کنید'
		} ]
	},
	description: {
		label: 'توضیحات',
		icon: 'teenyicons:hashtag-outline',
		type: 'textarea',
	},
})

const openFormDialog = () => {
	reset()
	dialog.value = true
}

const addProperty = async () => {
	btnLoading.value = true
	console.log(_data)
	const {data, error} = await useSend('/api/properties/inside', {
		method: 'POST',
		body: {
			..._data,
			type: PropertyType.INSIDE
		}
	})
	btnLoading.value = false
	err(error)
	if(msg(data)) {
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
				.flex.gap-4
					el-button(type="success" :icon="Add" @click="openFormDialog") افزودن مکان
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
	el-drawer(v-model="dialog" title="افزودن واحد مسکونی داخلی جدید" append-to-body :size="450" :close-on-click-modal="false")
		app-form(v-model="_data" :fields="fields" @ref="_form => form = _form")
		template(#footer)
			el-button(type="success" :icon="Save" :loading="btnLoading" @click="addProperty") ثبت
</template>
