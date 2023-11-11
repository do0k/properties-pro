<script lang="ts" setup>
import type { Ref } from 'vue'
import type { MenuItem } from '~/types'

const props = defineProps<{
  item:MenuItem,
  index: string
}>()
const disabled:Ref<boolean> = ref(!(props.item.route?.name && useRouter().hasRoute(props.item.route?.name as string)))

</script>

<template lang="pug">
el-sub-menu(v-if="item.items && item.items.length > 0" :index="`sub_${index}`")
  template(#title)
    el-icon
      icon(:name="item.icon")
    span.ml-2 {{ item.label }}
  app-menu-item(v-for="(_item,i) in item.items" :key="i" :item="_item" :index="`${index}_${i+1}`")
el-menu-item(v-else :index="`item_${index}`" :route="item.route" :disabled="disabled")
  el-icon
    icon(:name="item.icon")
  span.ml-2 {{ item.label }}
</template>
