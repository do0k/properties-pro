<script setup lang="ts">
defineProps<{
  order: string | undefined,
}>()
</script>
<template lang="pug">
.cursor-pointer
  icon(v-if="order" :name="(order === 'asc') ? 'teenyicons:sort-up-outline' : 'teenyicons:sort-down-outline'" size="15px").text-rose-600
  .flex(v-else)
    icon(name="teenyicons:arrow-up-outline" size="15px").text-gray-300.-mx-2
    icon(name="teenyicons:arrow-down-outline" size="15px").text-gray-300
</template>
