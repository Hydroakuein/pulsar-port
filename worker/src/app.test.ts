import { describe, expect, it } from "vitest";

import { apiErrorResponseSchema, healthResponseSchema } from "../../shared/api";
import app from "./app";
import type { Bindings } from "./types";

const bindings: Bindings = {
  APP_ENV: "test",
  CORS_ORIGIN: "http://localhost:1420",
};

describe("Pulsar Port API", () => {
  it.each(["/health", "/api/v1/health"])("returns health data from %s", async (path) => {
    const response = await app.request(path, undefined, bindings);
    const body = healthResponseSchema.parse(await response.json());

    expect(response.status).toBe(200);
    expect(response.headers.get("x-request-id")).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(body.data.environment).toBe("test");
  });

  it("returns the standard error envelope for unknown routes", async () => {
    const response = await app.request("/missing", undefined, bindings);
    const body = apiErrorResponseSchema.parse(await response.json());

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("NOT_FOUND");
    expect(body.error.requestId).toBe(response.headers.get("x-request-id"));
  });

  it("sets CORS and security headers", async () => {
    const response = await app.request(
      "/health",
      { headers: { Origin: "http://localhost:1420" } },
      bindings,
    );

    expect(response.headers.get("access-control-allow-origin")).toBe("http://localhost:1420");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });
});
