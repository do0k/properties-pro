<script lang="ts" setup>
import { ArrowLeft } from '@/components/icons'
// const routes = useRoute().matched

</script>

<template lang="pug">
el-breadcrumb(:separator-icon="ArrowLeft")
  el-breadcrumb-item(:to="{path: '/'}") فارکو
  el-breadcrumb-item(:to="{path: '/'}") داشبورد
</template>
