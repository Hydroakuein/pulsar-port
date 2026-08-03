import { describe, expect, it } from "vitest";

import { healthResponseSchema, paginationMetaSchema } from "./api";

describe("API contracts", () => {
  it("accepts a valid health response", () => {
    const result = healthResponseSchema.safeParse({
      success: true,
      data: {
        service: "pulsar-port-api",
        status: "ok",
        environment: "test",
        version: "0.1.0",
        timestamp: "2026-08-02T00:00:00.000Z",
      },
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid pagination values", () => {
    const result = paginationMetaSchema.safeParse({
      page: 0,
      pageSize: 20,
      totalItems: 0,
      totalPages: 0,
    });

    expect(result.success).toBe(false);
  });
});
