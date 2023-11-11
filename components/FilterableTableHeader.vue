<script lang="ts" setup>
import type { Ref } from 'vue'
import { err } from '~/utils/helpers'
interface ListItem {label:string, value:string}

const props = defineProps<{
  modelValue?: string|string[]|Date,
  type?: 'text'|'list'|'date',
  remoteUrl?: string,
  items?: ListItem[]
}>()
const emit = defineEmits(['update:modelValue'])
const filtered = ref(!!props.modelValue)
const visible = ref(false)
const model = ref<string|string[]|Date|undefined>(props.modelValue)
const loading = ref(false)
const options = ref<ListItem[]>()
const filter = () => {
  emit('update:modelValue', model.value)
  visible.value = false
}
const clear = () => {
  model.value = undefined
  emit('update:modelValue', undefined)
  visible.value = false
}
const remote = async (s:string | undefined) => {
  if (props.remoteUrl) {
    loading.value = true
    const { data, error } = await useFetch(props.remoteUrl, { server: false, lazy: true, query: { s } }) as { data: Ref<ListItem[]> }
    loading.value = false
    err(error)
    if (data.value) {
      options.value = data.value
    }
  } else if (props.items) {
    options.value = props.items
  } else {
    options.value = []
  }
}
const show = async () => {
  await remote('')
}
</script>

<template lang="pug">
el-popover(
  v-model:visible="visible"
  trigger="click"
  placement="bottom"
  :width="230"
  persistent
  :teleported="true"
  @show="show")
  template(#reference)
    icon.mx-2.cursor-pointer(name="teenyicons:filter-outline" size="15px" :class="filtered?'text-sky-400':'text-slate-300'" class="hover:text-sky-400 focus:outline-none")
  el-select.w-full(
    v-if="type === 'list'"
    ref="input"
    v-model="model"
    filterable,
    remote
    reserve-keyword,
    remote-show-suffix,
    :teleported="false"
    :popper-options="{'stop-propagation':true, 'prevent-default': true}"
    :remote-method="remote"
    size="small"
    clearable
    :loading="loading")
    el-option(v-for="(item, key) in options" :key="key" :label="item.label" :value="item.value")
  el-date-picker.w-full(
    v-else-if="type === 'date'"
    ref="input"
    v-model="model"
    :teleported="false",
    size="small"
    clearable
    :popper-options="{'stop-propagation':true, 'prevent-default': true}")
  el-input.w-full(v-else ref="input" v-model="model" size="small" clearable @keypress.enter="filter")
  .text-center.pt-3
    el-button-group(size="small")
      el-button(type="danger" round, :disabled="!filtered", @click="clear") حذفـــ
        template(#icon)
          icon(name="teenyicons:x-outline")
      el-button(type="primary" round, :disabled="!model || model === ''", @click="filter") صافی
        template(#icon)
          icon(name="teenyicons:filter-outline")
</template>
