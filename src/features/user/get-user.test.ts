import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the Prisma client module used by the handler
vi.mock('../../../database/prisma', () => ({
  default: {
    user: {
      findMany: vi.fn(),
    },
  },
}))

import prisma from '../../database/prisma'
import { getUsersHandler, getUsersResultSchema } from './get-users'

describe('getUsersHandler', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('queries prisma and returns users wrapped in `data`', async () => {
    const fakeUsers = [
      { id: 1, name: 'Alice', email: 'alice@example.com', phone: null },
    ]

    // Make sure the mocked `findMany` resolves the fake users
    const fn = (prisma.user.findMany as any)
    if (fn && typeof fn.mockResolvedValue === 'function') {
      fn.mockResolvedValue(fakeUsers)
    } else {
      prisma.user.findMany = vi.fn().mockResolvedValue(fakeUsers)
    }

    const json = vi.fn()
    const c: any = { json, res: { status: 200 } }

    await getUsersHandler(c)

    expect(prisma.user.findMany).toHaveBeenCalled()
    expect(json).toHaveBeenCalledWith(getUsersResultSchema.parse({ data: fakeUsers }))
  })
})
