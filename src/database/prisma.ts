import { PrismaClient } from '@prisma/client'

declare global {
  // allow attaching to the global object in dev to avoid multiple clients
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
  var process: NodeJS.Process
}

const g = globalThis as unknown as { __prisma?: PrismaClient }
const prisma = g.__prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') g.__prisma = prisma

export default prisma
