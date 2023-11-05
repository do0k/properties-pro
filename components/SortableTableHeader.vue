<script setup lang="ts">
defineProps<{
  label: string,
  index: number,
  order: string | undefined,
}>()
</script>
<template lang="pug">
.flex.justify-between.w-full.items-center.cursor-pointer
  span  {{ label }}
  icon(v-if="order" :name="(order === 'asc') ? 'teenyicons:sort-up-outline' : 'teenyicons:sort-down-outline'").text-rose-600
  .flex(v-else)
    icon(name="teenyicons:arrow-up-outline").text-gray-300.-mx-2
    icon(name="teenyicons:arrow-down-outline").text-gray-300
</template>
