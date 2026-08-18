import { Hono as App } from "hono";
import { openAPIRouteHandler, validator } from "hono-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { authMiddleware } from '../middleware/auth'

import { getUsersHandler, getUsersDescription, paginationQuerySchema } from "./user/get-users";
import { getUserHandler, getUserDescription, getUserParamsSchema } from "./user/get-user";
import { createUserHandler, createUserDescription, createUserRequestSchema } from "./user/create-user";
import { uploadFileHandler, uploadFileDescription, uploadFileRequestSchema } from "./file/upload-file";
import { downloadFileDescription, downloadFileHandler, downloadFileParamsSchema } from "./file/download-file";

export function registerUserEndpoints(app: App) {
  app.get("/users", getUsersDescription(), validator("query", paginationQuerySchema), authMiddleware, getUsersHandler);

  app.get("/users/:id", getUserDescription(), validator("param", getUserParamsSchema), authMiddleware, getUserHandler);

  app.post("/users", createUserDescription(), validator("json", createUserRequestSchema), authMiddleware, createUserHandler);
}

export function registerFileEndpoints(app: App) {
  app.get("/files/:id", downloadFileDescription(), validator("param", downloadFileParamsSchema), authMiddleware, downloadFileHandler);

  app.post("/files", uploadFileDescription(), validator('form', uploadFileRequestSchema), authMiddleware, uploadFileHandler);
}


export function registerScalarDocs(app: App) {
  app.get(
    "/openapi",
    openAPIRouteHandler(app, {
      documentation: { info: { title: "API", version: "1.0.0" } },
    }),
  );

  app.get("/docs", Scalar({ url: "/openapi", theme: "purple", pageTitle: "My API" }));
}

