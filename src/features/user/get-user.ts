import prisma from "../../database/prisma";
import { User } from "@prisma/client";
import { describeRoute, resolver } from "hono-openapi";
import { z } from "zod";

export const getUserParamsSchema = z.object({
  id: z.string(),
});

export const getUserResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
});

export function getUserDescription() {
  return describeRoute({
    summary: "Returns user by ID",
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: resolver(getUserResultSchema),
          },
        },
      },
    },
  });
}

// Handler

export async function getUserHandler(c: any): Promise<any> {
  const { id } = c.req.valid("param");

  const numericId = typeof id === "string" ? Number(id) : id;
  if (Number.isNaN(numericId)) return null;

  const user: User | null = await prisma.user.findUnique({ where: { id: numericId } });

  var result = user ? getUserResultSchema.parse(user) : null;

  return c.json(result);
}
