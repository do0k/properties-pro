<script lang="ts" setup>
import type { CargoConfirm, User, Profile } from '@prisma/client'

const props = defineProps<{
  confirms:(CargoConfirm & {user:(User & {profile: Profile})})[]
}>()
const accepts = computed(() => [
  'تایید بخش QC',
  'تایید بخش بازرگانی',
  'تایید بخش انبار',
  'تایید بخش تولید'
].map(_as => props.confirms.filter(con => con.as === _as)[0]?.isConfirmed))
</script>

<template lang="pug">
el-popover(placement="bottom" trigger="click" :width="300" )
  template(#reference)
    el-button(text)
      .flex.gap-1
        template(v-for="(accept, key) in accepts" :key="key")
          icon(v-if="accept" name="teenyicons:tick-circle-outline").text-emerald-600
          icon(v-else-if="accept === undefined" name="teenyicons:minus-circle-outline").text-gray-400
          icon(v-else name="teenyicons:x-circle-outline").text-rose-600
  div(v-if="confirms.length > 0" )
    .py-1(v-for="confirm in confirms" :key="confirm.id")
      el-alert(:type="confirm.isConfirmed ? 'success':'error'" :closable="false")
        template(#title)
          .fort-bold {{ confirm.isConfirmed ? '' : 'عدم ' }}{{ confirm.as }} توسط {{ confirm.user.profile.name }} {{ confirm.user.profile.family }}
        .pl-2(v-if="confirm.reason && confirm.reason !== 'null'" ) {{ confirm.reason }}
  div(v-else)
    .py-1
      el-alert(type="warning" :closable="false")
        template(#title)
          .fort-bold هیچ تاییدی برای این محموله ثبت نشده
</template>
