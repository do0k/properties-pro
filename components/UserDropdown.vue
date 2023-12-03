<script lang="ts" setup>
import type { Ref } from 'vue'
import { Ring, UserFilled, Power, Settings } from '@/components/icons'
import type { AppUser } from '~'
const { signOut, data } = await useAuth()

const user:Ref<AppUser|null> = ref(data?.value?.user?.name as AppUser | null)
const logout = async () => {
  try {
    const res = await ElMessageBox.confirm('آیا برای خروج از سیستم اطمینان دارید؟', 'خروج', {
      confirmButtonText: 'بله',
      cancelButtonText: 'خیر',
      showClose: false
    })
    if (res === 'confirm') {
      const wait = ElMessage({
        message: 'درحال خروج از سیستم...',
        duration: 0,
        icon: Ring
      })
      if (signOut) {
        await signOut()
      }
      wait.close()
    }
  } catch (e) {}
}
</script>

<template lang="pug">
el-dropdown(trigger="click")
  el-button(text circle)
    template(#icon)
      icon(name="material-symbols:account-circle-full" size="15px")
  template(#dropdown)
    .flex.items-center.p-2.w-50
      el-avatar(:icon="UserFilled" shape="square" )
      el-divider(direction="vertical")
      .font-bold(v-if="user")
        .text-indigo-600 {{ user?.name }}
        .text-indigo-300 {{ user?.role.name }}
        //.text-indigo-300 {{ data.value.user?.role.name }}
    el-divider(class="!my-1")
    .flex.flex-col.gap-2.p-2.stacked
      el-button(:icon="Settings" plain round) تنظیمات حساب
      el-button(type="danger" :icon="Power" plain round, @click="logout") خروج از حساب
</template>
