import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join("schema.prisma"),

  migrations: {
    path: path.join("migrations"),
    seed: "tsx prisma/seed.ts",
  },

  // Optional: TypedSQL queries location
  // typedSql: {
  //   path: path.join("prisma", "queries"),
  // },

  // Optional: SQL views
  // views: {
  //   path: path.join("prisma", "views"),
  // },

  datasource: {
    url: env("DATABASE_URL"),
  },

  // Optional experimental features
  // experimental: {
  //   externalTables: true,
  // },

  // tables: {
  //   external: ["public.legacy_table"],
  // },
});