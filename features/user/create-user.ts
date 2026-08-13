import { z } from 'zod'

export async function createUser(c: any) {
  const body = c.req.valid("json");

  const newUser = {
    id: crypto.randomUUID(),
    ...body,
    createdAt: new Date().toISOString(),
  };

  return c.json(newUser, 201);
}


export const CreateUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  role: z.enum(['user', 'admin']).default('user'),
})
