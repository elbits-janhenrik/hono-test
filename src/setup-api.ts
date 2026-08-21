import "dotenv/config";
import { Hono as App } from "hono";
import { except } from "hono/combine";
import { HTTPException } from "hono/http-exception";

import { authMiddleware } from "./middleware/auth";
import { registerUserEndpoints, registerFileEndpoints, registerScalarDocs } from "./features/register-endpoints";

export function setupApi(app: App) {
  app.use("*", except(["/docs", "/docs/*", "/openapi", "/openapi/*"], authMiddleware));

  app.get("/", (c) => {
    return c.json({ message: "Hono + Zod API is running" });
  });

  registerUserEndpoints(app);

  registerFileEndpoints(app);

  registerScalarDocs(app);

  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse();
    }

    console.error(err);
    return c.json({ error: "Internal Server Error" }, 500);
  });
}
