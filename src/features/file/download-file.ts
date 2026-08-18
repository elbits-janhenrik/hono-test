import prisma from "../../database/prisma";
import { z } from "zod";
import { describeRoute, resolver } from "hono-openapi";

export const downloadFileParamsSchema = z.object({
  id: z.string()
});

export const downloadFileResultSchema = z.object({
  data: z.file(),
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
            schema: resolver(downloadFileResultSchema),
          },
        },
      },
    },
  });
}

// Handler

export async function downloadFileHandler(c: any) {
  const { id } = c.req.valid("param");

  const numericId = typeof id === "string" ? Number(id) : id;
  if (Number.isNaN(numericId)) return null;

  const file = await prisma.fileUpload.findUnique({
    where: { id: numericId },
  });

  if (!file) {
    return c.json({ error: "File not found" }, 404);
  } 

  c.header('Content-Type', 'image/jpeg');
  c.header('Content-Disposition', 'attachment; filename="' + file.fileName + '"');
  
  return c.body(  file.contents)
}
  