// import { describeRoute, resolver } from "hono-openapi";
// import { z } from "zod";

// export const getUserResultSchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   email: z.string(),
//   phone: z.string().nullable().optional(),
// });

// export function getUserDescription() {
//   return describeRoute({
//     summary: "Returns all or selected users",
//     responses: {
//       200: {
//         description: "Success",
//         content: {
//           "application/json": {
//             schema: resolver(getUserResultSchema),
//           },
//         },
//       },
//     },
//   });
// }

// export async function getUser(c: any) {
//   const { id } = c.req.valid("param");

//   return c.json({
//     id,
//     name: "John Doe",
//     email: "john@example.com",
//   });
// }

// export const UserIdParamSchema = z.object({
//   id: z.string(),
// });
