<script lang="ts" setup>
import type { Ref } from 'vue'
import { getCurrentRouteIndex, err } from '~/utils/helpers'
import type { MenuItem } from '~'

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const collapse:Ref<boolean> = useVModel(props, 'modelValue', emit)
const { width } = useWindowSize()
watch(width, (width) => {
  collapse.value = width <= 1024
})
const { data, error, pending } = await useLazyFetch('/api/app/menu', { server: false })
if (error.value) {
  err(error)
}

const defaultActive = computed(() => getCurrentRouteIndex(data.value as MenuItem[], useRouter().currentRoute.value.name || ''))
</script>

<template lang="pug">
el-aside(width="auto")
  el-menu.main-menu(
    router
    unique-opened
    :collapse="collapse"
    background-color="#3730a3"
    active-text-color="#fef9c3"
    :default-active="defaultActive"
    text-color="#fff"
  )
    .el-menu-item.app-title
      el-icon
        icon(name="teenyicons:grid-layout-outline" size="15px")
      span.ml-2 سامانه اماکن
    el-skeleton(:loading="pending", animated style="--el-skeleton-color: #5a58d3; --el-skeleton-to-color: #4b4abf;")
      template(#template)
        .flex.justify-between.items-center.px-3.gap-3.my-3(v-for="i in [1,2,3,4,5,6,7,8,9,10]" :key="i")
          el-skeleton-item(variant="circle" style="width: 1.8rem; height: 23px;")
          el-skeleton-item(variant="text")
      app-menu-item(v-for="(item, i) in data" :key="i" :item="item" :index="`${i+1}`")
    el-space
    .el-menu-item.nav-footer
      .text-xs.text-indigo-300 1.0.0
</template>
