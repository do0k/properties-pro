<script lang="ts" setup>
defineProps<{
  title:string,
  icon?:string,
  iconSize?:string
}>()
</script>

<template lang="pug">
.el__bar(class="m-[-1.3rem]")
  .mr-2
    slot(name="icon")
      icon(v-if="icon" :name="icon" :size="iconSize || '1rem'")
  .flex-auto.font-bold.text-sm
    slot {{ title }}
  .ml-auto
    slot(name="end")
</template>

<style lang="sass" global>
.el__bar
  @apply mt--3 flex items-center justify-center mb-5 px-3 h-10 bg-stone-100 text-stone-500
</style>
