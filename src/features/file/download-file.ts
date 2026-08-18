import prisma from "../../database/prisma";
import { z } from "zod";
import { describeRoute, resolver } from "hono-openapi";

export const downloadFileRequestSchema = z.object({
  id: z.number(),
});

export const downloadFileResultSchema = z.object({
  id: z.number(),
  fileName: z.string(),
  size: z.number(),
  type: z.string(),
  description: z.string().optional(),
  savedAs: z.string().optional(),
});

export function downloadFileDescription() {
  return describeRoute({
    tags: ["Files"],
    summary: "Download a file",
    description: "Download a file by its ID",
    responses: {
      200: {
        description: "File downloaded successfully",
        content: {
          "application/json": {
            schema: resolver(downloadFileResultSchema),
          },
        },
      },
      400: {
        description: "Invalid request",
        content: {
          "application/json": {
            schema: resolver(z.object({ error: z.string() })),
          },
        },
      },
    },
  });
}

// Handler

export async function downloadFileHandler(c: any) {
  const { id } = c.req.valid("json");

  const file = await prisma.fileUpload.findUnique({
    where: { id },
  });

  if (!file) {
    return c.json({ error: "File not found" }, 404);
  }

  return c.json(downloadFileResultSchema.parse(file));
}
  