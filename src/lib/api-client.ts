import { hc } from "hono/client";
import type { ClientRequestOptions } from "hono/client";

import { healthResponseSchema, type HealthResponse } from "../../shared/api";
import type { AppType } from "../../worker/src/app";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8787";

export const createApiClient = (
  baseUrl = import.meta.env.VITE_API_BASE_URL,
  options?: ClientRequestOptions,
) => hc<AppType>(baseUrl || DEFAULT_API_BASE_URL, options);

export type PulsarPortApiClient = ReturnType<typeof createApiClient>;

export class ApiClientError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

const apiClient = createApiClient();

export const getApiHealth = async (client = apiClient): Promise<HealthResponse> => {
  const response = await client.api.v1.health.$get();

  if (!response.ok) {
    throw new ApiClientError("Unable to reach the Pulsar Port API.", response.status);
  }

  return healthResponseSchema.parse(await response.json());
};
