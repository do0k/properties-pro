import { PrismaClient } from '@prisma/client'
process.env.PGTZ = 'Asia/Tehran'
export const db = new PrismaClient()
