import prisma from "../../database/prisma";
import { User, Prisma } from "@prisma/client";
import { z } from 'zod'
import { describeRoute, resolver } from "hono-openapi";

export const createUserRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
});

export const createUserResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
});

export function createUserDescription() {
  return describeRoute({
    summary: "Creates a new user",
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: resolver(createUserResultSchema),
          },
        }
      },
    },
  });
}


// Handler

export async function createUserHandler(c: any) {
  const body = c.req.valid("json");

  try {
    const createdUser: User = await prisma.user.create({
      data: { ...body}
    });

    const jwtToken = c.get('jwtPayload')

    const result = createdUser ? createUserResultSchema.parse(createdUser) : null;
    return c.json(result, 201);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const target = (err.meta && (err.meta as any).target) ? (err.meta as any).target : undefined;
      return c.json({ error: 'Unique constraint failed', target }, 409);
    }
    throw err;
  }
}

