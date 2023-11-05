<script lang="ts" setup>
import type { Ref } from 'vue'
import { FFDigits } from '~/utils/formatters'
const weight:Ref<number> = ref(0)
const fixable = ref(false)

onMounted(() => {
  const track = new Audio('http://soundbible.com/grab.php?id=2158&type=mp3')
  const alarmed = ref(false)
  const alarm = () => {
    if (!alarmed.value) { track.play() }
    return true
  }
  const { $socket } = useNuxtApp()
  $socket.on('scale', (_weight:number, _fixable:boolean) => {
    weight.value = _weight
    fixable.value = _fixable
    if (!!useRuntimeConfig().public.alarm && _fixable && _weight > 0) { alarmed.value = alarm() }
  })
})
</script>

<template lang="pug">
el-tag.flexible(v-show="weight > 0" :type="fixable ? 'success': 'danger'" effect="light" round)
  span.uppercase.-mb-1 KG
  .text-sm {{ FFDigits(weight) }}
  icon.-scale-x-100(name="ph:truck-thin" size="1.35rem")
</template>
