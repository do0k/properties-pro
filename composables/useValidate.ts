import type { H3Event } from 'h3'
import type { z, Schema } from 'zod'
export { z as schema } from 'zod'
export const useValidate = async <TBody>(event:H3Event, schema:Schema<TBody>) => {
  const _data = await readBody<z.infer<typeof schema>>(event)
  const validate = await schema.safeParseAsync(_data)
  if (!validate.success) { throw createError({ statusCode: 422, data: validate.error.flatten().fieldErrors }) }
  return validate.data
}
