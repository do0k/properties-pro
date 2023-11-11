<script lang="ts" setup>
import type { FetchError } from 'ofetch'
import { Refresh } from '~/components/icons'
const props = defineProps<{
  error?: FetchError<{ message:string }> | null
  refresh?: Function
  pending?: boolean
}>()

const classes = computed(() => (props.error?.statusCode || 500) >= 500 ? 'bg-rose-200 text-rose-600' : 'bg-amber-200 text-amber-600')
</script>

<template lang="pug">
template(v-if="!error")
  slot
template(v-else)
  .p-5.rounded-xl(:class="classes")
    .flex.items-center.gap-3
      .text-3xl {{ error ? error.statusCode : '500' }}
      el-button(v-if="refresh !== undefined" type="danger" :loading="pending || false" :icon="Refresh" @click="() => refresh()") سعی مجدد
    pre.mt-3.text-base.text-right(v-if="error?.statusCode === 500" dir="ltr") {{ error?.data?.message }}
    .mt-3.text-base(v-else) {{ error ? error?.data?.message : 'خطای ناشناخته' }}
</template>
