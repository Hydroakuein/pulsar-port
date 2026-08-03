import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

import {
  apiErrorResponseSchema,
  appEnvironmentSchema,
  healthResponseSchema,
  type ApiErrorResponse,
} from "../../shared/api";
import type { WorkerEnvironment } from "./types";

const API_VERSION = "0.1.0";

const app = new Hono<WorkerEnvironment>();

app.use("*", async (context, next) => {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  context.set("requestId", requestId);

  try {
    await next();
  } finally {
    context.header("x-request-id", requestId);
    console.log(
      JSON.stringify({
        level: "info",
        requestId,
        method: context.req.method,
        path: context.req.path,
        status: context.res.status,
        durationMs: Date.now() - startedAt,
      }),
    );
  }
});

app.use("*", secureHeaders());
app.use(
  "*",
  cors({
    origin: (_origin, context) => context.env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    exposeHeaders: ["X-Request-Id"],
    maxAge: 86400,
  }),
);

const healthHandler = (context: Context<WorkerEnvironment>) => {
  const environment = appEnvironmentSchema.parse(context.env.APP_ENV);
  const response = healthResponseSchema.parse({
    success: true,
    data: {
      service: "pulsar-port-api",
      status: "ok",
      environment,
      version: API_VERSION,
      timestamp: new Date().toISOString(),
    },
  });

  return context.json(response, 200);
};

const routes = app.get("/health", healthHandler).get("/api/v1/health", healthHandler);

routes.notFound((context) => {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "The requested resource was not found.",
      requestId: context.get("requestId"),
    },
  };

  return context.json(apiErrorResponseSchema.parse(response), 404);
});

routes.onError((error, context) => {
  const requestId = context.get("requestId") ?? crypto.randomUUID();
  console.error(
    JSON.stringify({
      level: "error",
      requestId,
      method: context.req.method,
      path: context.req.path,
      error: error instanceof Error ? error.message : "Unknown error",
    }),
  );

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
      requestId,
    },
  };

  context.header("x-request-id", requestId);
  return context.json(apiErrorResponseSchema.parse(response), 500);
});

export type AppType = typeof routes;

export default routes;
