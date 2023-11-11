import { getServerSession } from '#auth'
import { db } from '~/server/db'

export default defineEventHandler(async (event) => {
  const user = (await getServerSession(event))?.user
  if (user) {
    const role = await db.role.findUnique({ where: { userId: user.id } })
    await db.$disconnect()
    event.context.user = {
      ...user?.name,
      can: (perms: string|string[]):boolean => {
        if(!role) {
          return false
        }
        if(Array.isArray(perms)) {
          let can = false
          for(const perm of perms) {
            if(role?.perms.includes(perm) || false) {
              can = true
            }
          }
          return can
        } else {
          return role?.perms.includes(perms) || false
        }
      }
    }
  }
})