<script lang="ts" setup>
import { FDigits } from '~/utils/formatters'

const props = defineProps<{
  number: string,
  type?: 'normal' | 'taxi' | 'diesel' | 'bus' | 'army' | 'formality' | 'gov' | 'diplomat' | 'service' | 'police' | 'irgc' | 'defence' | 'armed'
}>()
const arr = computed(() => props.number.replace('ایران/', '').split(/\D/).map(n => FDigits(n)))
let letter = Array.from(props.number.replace('ایران/', '')).filter(char => isNaN(Number(char)) && char !== '-')[0]
let bg = ''
switch (props.type) {
  case 'taxi':
    letter = 'ت'
    bg = 'bg-yellow-400 text-black'
    break
  case 'diesel':
    letter = 'ک'
    bg = 'bg-yellow-400 text-black'
    break
  case 'bus':
    letter = 'ع'
    bg = 'bg-yellow-400 text-black'
    break
  case 'army':
    letter = 'ش'
    bg = 'bg-[#D0B17B] text-black'
    break
  case 'formality':
    letter = 'تشریفات'
    bg = 'bg-red-600 text-white'
    break
  case 'gov':
    letter = 'الف'
    bg = 'bg-red-600 text-white'
    break
  case 'diplomat':
    letter = 'D'
    bg = 'bg-indigo-300 text-black'
    break
  case 'service':
    letter = 'S'
    bg = 'bg-indigo-300 text-black'
    break
  case 'police':
    letter = 'پ'
    bg = 'bg-emerald-800 text-white'
    break
  case 'irgc':
    letter = 'ث'
    bg = 'bg-emerald-800 text-white'
    break
  case 'defence':
    letter = 'ز'
    bg = 'bg-sky-500 text-white'
    break
  case 'armed':
    letter = 'ف'
    bg = 'bg-sky-500 text-white'
    break
  case 'normal':
  default:
    bg = 'bg-white text-black'
    break
}
</script>

<template lang="pug">
.shadow-md.border.border-slate-500.rounded.flex.items-center.justify-center.w-26.h-6.overflow-y-hidden(:class="bg")
  .border-r.border-slate-500.px-1
    span(v-show="arr[0]") {{ arr[0] }}
  .text-sm.p-1.flex-1.text-center.flex
    span(v-show="(arr[2] && letter === 'تشریفات') || arr[1]") {{ letter === 'تشریفات' ? arr[2] : arr[1] }}
    span.flex-1(v-show="letter") {{ letter }}
    span(v-show="arr[2] && letter !== 'تشریفات'") {{ arr[2] }}
  .bg-blue-800.w-1.h-6
</template>
