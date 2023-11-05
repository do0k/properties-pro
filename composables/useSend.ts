import type { Ref } from 'vue'
import { FetchError } from 'ofetch'
export type UseSendOptions<T> = {
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: T
}
export const useSend = async <DataT, BodyT>(url: string, opts:UseSendOptions<BodyT | any>) => {
  const data:Ref<DataT | null> = ref(null)
  const error:Ref<FetchError | null> = ref(null)
  try {
    data.value = await $fetch<DataT | any>(url, opts)
  } catch (err) {
    if (err instanceof FetchError) { error.value = err }
  }
  return { data, error }
}
