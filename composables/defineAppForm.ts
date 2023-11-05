import type { FormInstance } from 'element-plus'
import type { Ref } from 'vue'
import type { AppFormFields, AppFormData } from '~/types'

export const defineAppForm = (rawFields:AppFormFields):[AppFormFields, AppFormData, Ref<FormInstance>] => [
  reactive(rawFields),
  reactive(resolveData(rawFields)),
  // @ts-ignore
  ref<FormInstance>()
]
const resolveData = (target:AppFormFields):AppFormData => {
  return Object.keys(target).reduce(
    (object, field) => (
      target[field].group ? { ...object, [field]: { ...resolveData(<AppFormFields>target[field].group) } } : { ...object, [field]: target[field].value }
    ), {})
}
