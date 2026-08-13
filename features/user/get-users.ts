import { z } from 'zod'

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
})

export async function getUsers(c : any) {
  // const { page, limit, search } = c.req.valid('query')

  const data = {
    // page,
    // limit,
    // search: search ?? null,
    data: [
      { id: '1', name: 'Alice', email: 'alice@example.com' },
      { id: '2', name: 'Bob', email: 'bob@example.com' },
    ]
  }
  
  return c.json(data);
}
