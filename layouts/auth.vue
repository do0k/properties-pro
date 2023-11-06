<script lang="ts" setup>
import locale from '~/locales/fa/element-plus-locale.mjs'

useHead({
  htmlAttrs: {
    lang: 'fa',
    dir: 'rtl'
  }
})
</script>

<template lang="pug">
el-config-provider(:locale="locale")
  .flex.h-screen.justify-center.items-center
    slot
</template>
