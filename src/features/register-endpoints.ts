import { Hono as App } from "hono";
import { openAPIRouteHandler, validator } from "hono-openapi";
import { Scalar } from "@scalar/hono-api-reference";

// handler, description, and schema imports
import { getUsersHandler, getUsersDescription, paginationQuerySchema } from "./user/get-users";
import { getUserHandler, getUserDescription, getUserParamsSchema } from "./user/get-user";
import { createUserHandler, createUserDescription, createUserRequestSchema } from "./user/create-user";
import { uploadFileHandler, uploadFileDescription, uploadFileRequestSchema } from "./file/upload-file";
import { downloadFileHandler, downloadFileDescription, downloadFileParamsSchema } from "./file/download-file";

export function registerUserEndpoints(app: App) {
  app.get("/users", getUsersDescription(), validator("query", paginationQuerySchema), getUsersHandler);

  app.get("/users/:id", getUserDescription(), validator("param", getUserParamsSchema), getUserHandler);

  app.post("/users", createUserDescription(), validator("json", createUserRequestSchema), createUserHandler);
}

export function registerFileEndpoints(app: App) {
  app.get("/files/:id", downloadFileDescription(), validator("param", downloadFileParamsSchema), downloadFileHandler);

  app.post("/files", uploadFileDescription(), validator("form", uploadFileRequestSchema), uploadFileHandler);
}

export function registerScalarDocs(app: App) {
  app.get(
    "/openapi",
    openAPIRouteHandler(app, {
      documentation: {
        info: { title: "API", version: "1.0.0" },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    }),
  );

  app.get("/docs", Scalar({ url: "/openapi", persistAuth: true, showDeveloperTools: "never", theme: "purple", pageTitle: "My API",
      authentication: {
        preferredSecurityScheme: "bearerAuth",
      },

   }));
}
