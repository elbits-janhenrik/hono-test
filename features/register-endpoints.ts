import { Hono as App } from "hono";
import { openAPIRouteHandler, validator } from "hono-openapi";
import { Scalar } from "@scalar/hono-api-reference";

import { getUsersHandler, getUsersDescription, PaginationQuerySchema } from "./user/get-users";
import { getUserHandler, getUserParamsSchema, getUserDescription } from "./user/get-user-from-db";
import { createUser, CreateUserSchema } from "./user/create-user";

export function registerUserEndpoints(app: App) {
  app.get("/users", getUsersDescription(), validator("query", PaginationQuerySchema), getUsersHandler);

  app.get("/users/:id", getUserDescription(), validator("param", getUserParamsSchema), getUserHandler);

  app.post("/users", validator("json", CreateUserSchema), createUser);

  app.get(
    "/openapi",
    openAPIRouteHandler(app, {
      documentation: { info: { title: "API", version: "1.0.0" } },
    }),
  );

  app.get("/docs", Scalar({ url: "/openapi", theme: "purple", pageTitle: "My API" }));
}
