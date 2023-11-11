<script lang="ts" setup>
import type { Ref } from 'vue'
import type { NotifyGet } from '~/types'
import { humanDate, err, randomNumber } from '~/utils/helpers'
import { Refresh } from '~/components/icons'

const drawer = ref(false)
const { data, error, pending, refresh } = await useFetch('/api/app/notifications/', { server: false, lazy: true }) as { data: Ref<NotifyGet[]> }
err(error)
const notifies:Ref<NotifyGet[]> = ref([])
watch(() => data.value, (value:NotifyGet[]) => {
  notifies.value = value.filter(notify => notify.recipients && !notify.recipients[0].read)
})
onMounted(() => {
  const { $socket } = useNuxtApp()
  $socket.on('message', (message:string, sender: {profile: {name: string, family: string} | null} | null) => {
    notifies.value.push({ id: randomNumber * -1, message, createdAt: new Date(), sender })
  })
})
const read = async (notify:NotifyGet) => {
  if (notify.id && notify.id > 0) {
    const { error } = await useSend(`/api/app/notifications/${notify.id}`, { method: 'PUT' })
    err(error)
    await refresh()
  } else {
    notifies.value = notifies.value.filter(_notify => notify.id !== _notify.id)
  }
}
const getTitle = (notify:NotifyGet) => {
  return notify.sender ? `${notify.sender.profile?.name} ${notify.sender.profile?.family}` : 'سیستم'
}
const openDrawer = async () => {
  drawer.value = true
  await refresh()
}
</script>

<template lang="pug">
el-dropdown(trigger="click")
  el-badge(is-dot, :hidden="notifies?.length === 0")
    el-button(text circle :loading="pending")
      template(#icon)
        icon(name="teenyicons:bell-outline" size="15px")
  template(#dropdown)
    .p-2.flex.flex-col.gap-2(v-if="notifies.length > 0" class="w-[300px]")
      el-alert(
        v-for="(notify, key) in notifies"
        :key="key"
        :description="notify.message"
        close-text="متوجه شدم"
        type="success"
        closable
      @close="read(notify)")
        template(#title)
          .flex.items-center.gap-1
            .font-bold {{ getTitle(notify) }}
            el-tag.font-medium(type="success" round effect="plain" size="small") {{ humanDate(notify.createdAt) }}
      el-button(plain type="info" @click="openDrawer()") آرشیو پیام‌های من
    el-empty.mx-5(v-else description="هیچ پیام جدیدی ارسال نشده است" :image-size="80")
      template(#image)
        el-image(src="/empty-message.jpg" )
      template(#default)
        el-button(plain type="info" @click="openDrawer()") آرشیو پیام‌های من
el-drawer(v-model="drawer" :width="300", append-to-body)
  template(#header)
    .flex.items-center.gap-2
      .font-bold آرشیو پیام‌ها
      el-button(
        :loading="pending"
        :icon="Refresh"
        size="small"
        text
        round,
        @click="() => refresh()"
      ) &nbsp;تازه‌سازی
  el-skeleton(:loading="pending" animated)
    template(#template)
      .flex.gap-4.mb-5(v-for="i in 5" :key="i")
        el-skeleton-item(variant="circle" style="width:22px;height:20px")
        .flex.flex-col.gap-1.w-full
          el-skeleton-item(variant="rect" style="height:20px")
          el-skeleton-item(variant="rect" style="height:60px")
    el-timeline
      el-timeline-item(v-for="(notify, key) in data" :key="key" center placement="top")
        .flex.flex-col.gap-1
          el-tag(:type="notify.recipients[0].read ? 'info':'success'" effect="plain" size="small") {{ humanDate(notify.createdAt) }}
          el-alert.fill(
            :title="getTitle(notify)"
            :description="notify.message"
            close-text="متوجه شدم"
            :closable="false"
            :type="notify.recipients[0].read ? 'info':'success'"
          @close="read(notify).then()")
            template(#title)
              .flex.items-center.gap-1.mb-3
                .font-bold {{ getTitle(notify) }}
                el-space
                el-button(
                  v-if="!notify.recipients[0].read"
                  round
                  plain
                  size="small"
                  type="success"
                  @click="read(notify).then()") متوجه شدم
                  template(#icon)
                    icon(name="teenyicons:tick-outline")
                el-tag(v-else round size="small" type="info" effect="plain" ) خوانده شده
  </template>
