import { getServerSession } from '#auth'
import { db } from '~/server/db'
import type { Permission } from '~'
import type { Role, User } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const user = <{name: User}><unknown>(await getServerSession(event))?.user
  if (user) {
    const role = (await db.role.findUnique({ where: { userId: user.name.id } })) as Role & {perms: Permission[]}
    await db.$disconnect()
    event.context.user = {
      ...user?.name,
      role: role.slug,
      can: (perms: string|string[]):boolean => {
        if(!role) {
          return false
        }
        if(Array.isArray(perms)) {
          let can = false
          for(const perm of perms) {
            if(role?.perms.some((item: Permission) => item.slug === perm)) {
              can = true
            }
          }
          return can
        } else {
          return role?.perms.some((item: Permission) => item.slug === perms) || false
        }
      }
    }
  }
})