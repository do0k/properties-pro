<script lang="ts" setup>
defineProps<{
  label: string
}>()
</script>

<template lang="pug">
.flex.w-full.items-center
  el-text(size="small" type="info" truncated).font-bold {{ label }}
  el-space
  slot
</template>
