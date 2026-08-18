import prisma from "../../database/prisma";
import { User, Prisma } from "@prisma/client";
import { z } from "zod";
import { describeRoute, resolver } from "hono-openapi";

export const uploadFileRequestSchema = z.object({
  file: z.instanceof(File),
  message: z.string().optional(),
});

export const uploadFileResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  description: z.string().optional(),
  savedAs: z.string().optional(),
});

export function uploadFileDescription() {
  return describeRoute({
    tags: ["Upload"],
    summary: "Upload a file",
    description: "Upload a file via multipart/form-data",
    responses: {
      200: {
        description: "File uploaded successfully",
        content: {
          "application/json": {
            schema: resolver(uploadFileResultSchema),
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

export async function uploadFileHandler(c: any) {
  const { file, description } = c.req.valid("form");

  if (!(file instanceof File)) {
    return c.json({ error: "File is required" }, 400);
  }

  // Save example
  // await mkdir(join(process.cwd(), 'uploads'), { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  // await writeFile(join(process.cwd(), 'uploads', filename), buffer)

  

  return c.json({
    name: file.name,
    size: file.size,
    type: file.type,
    description,
    savedAs: filename,
  });
}
