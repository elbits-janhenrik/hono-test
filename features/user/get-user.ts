import { z } from 'zod'

export async function getUser(c: any) {
  const { id } = c.req.valid("param");

  return c.json({
    id,
    name: "John Doe",
    email: "john@example.com",
  });
}

export const UserIdParamSchema = z.object({
  id: z.string(),
})
