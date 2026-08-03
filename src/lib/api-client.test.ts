import { describe, expect, it } from "vitest";

import app from "../../worker/src/app";
import type { Bindings } from "../../worker/src/types";
import { createApiClient, getApiHealth } from "./api-client";

const bindings: Bindings = {
  APP_ENV: "test",
  CORS_ORIGIN: "http://localhost:1420",
};

describe("API client", () => {
  it("reads and validates health data through the typed Hono client", async () => {
    const client = createApiClient("http://pulsar-port.test", {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const request = input instanceof Request ? input : new Request(input, init);
        return app.request(request, undefined, bindings);
      },
    });

    const response = await getApiHealth(client);

    expect(response.success).toBe(true);
    expect(response.data.service).toBe("pulsar-port-api");
    expect(response.data.environment).toBe("test");
  });
});
