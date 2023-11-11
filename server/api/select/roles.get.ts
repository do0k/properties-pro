import { db } from '~/server/db'

export default defineEventHandler(async (event) => {
  const { s } = getQuery(event) as { s: string | undefined }
  const name = { contains: s || '' }
  const items = await db.role.findMany({
    where: {
      name
    }
  })
  await db.$disconnect()
  return items.map(item => ({ label: item.name, value: item.slug }))
})