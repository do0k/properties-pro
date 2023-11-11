<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { reactive } from 'vue'
import type { AppFormData, AppFormDataValue } from '~/types'

globalThis.ASYNC_VALIDATOR_NO_WARNING = 1
const props = defineProps<{
  modelValue?:{[P in keyof AppFormData]: AppFormDataValue},
  fields: AppFormData,
  labelPosition?: 'left' | 'right' | 'top'
}>()
const emit = defineEmits(['update:modelValue', 'ref'])
const data = useVModel(props, 'modelValue', emit)
const rules = reactive<FormRules>(
  Object.keys(props.fields)
    .reduce(
      (object, value) => (
        props.fields[value].group
          ? { ...object, ...Object.keys(props.fields[value].group).reduce((obj, val) => ({ ...obj, [`${value}.${val}`]: props.fields[value].group[val].rule }), {}) }
          : { ...object, [value]: props.fields[value].rule }
      ),
      {})
)
const Form = ref<FormInstance>()
onMounted(() => {
  emit('ref', Form.value)
})
</script>

<template lang="pug">
el-form(
  ref="Form",
  :model="data",
  :rules="rules",
  label-width="120px",
  status-icon,
  scroll-to-error,
  :scroll-into-view-options="{ behavior:'smooth', block: 'center'}"
  :label-position="labelPosition")
  template(v-for="(field, key) in fields" :key="key")
    slot(:name="`field-${String(key)}`" :field="field")
      app-form-item(v-model="data[key]" :field="field" :prop="String(key)")
</template>
