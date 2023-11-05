<script lang="ts" setup>
import type { FetchError } from 'ofetch'
const props = defineProps<{
  error?: FetchError<{ message:string }> | null
}>()

const classes = computed(() => (props.error?.statusCode || 500) >= 500 ? 'bg-rose-200 text-rose-600' : 'bg-amber-200 text-amber-600')
</script>

<template lang="pug">
template(v-if="!error")
  slot
template(v-else)
  .p-5.rounded-xl(:class="classes")
    .text-3xl {{ error ? error.statusCode : '500' }}
    .mt-3.text-base {{ error ? error?.data?.message : 'خطای ناشناخته' }}
</template>
