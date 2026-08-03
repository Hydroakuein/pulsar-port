import type { z } from "zod";

import type { appEnvironmentSchema } from "../../shared/api";

export type AppEnvironment = z.infer<typeof appEnvironmentSchema>;

export type Bindings = {
  APP_ENV: AppEnvironment;
  CORS_ORIGIN: string;
};

export type Variables = {
  requestId: string;
};

export type WorkerEnvironment = {
  Bindings: Bindings;
  Variables: Variables;
};
