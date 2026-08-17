import prisma from '../../database/prisma'
import { describeRoute, resolver } from 'hono-openapi'
import { User } from '@prisma/client'
import { z } from 'zod'

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
})

export const getUsersResultSchema = z.object({
  data: z.array(z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    phone: z.string().nullable().optional(),
  })),
})

// export type UsersResult = z.infer<typeof UsersResultSchema>

export function getUsersDescription() {
  return describeRoute({
    summary: 'Returns all or selected users',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: resolver(getUsersResultSchema),
          },
        },
      },
    },
  })
}

// Handler

export async function getUsersHandler(c: any) : Promise<any> {
  const users : Array<User> = await prisma.user.findMany({
    select: { id: true, name: true, email: true, phone: true }
  })

  return c.json(getUsersResultSchema.parse({ data: users }))
}