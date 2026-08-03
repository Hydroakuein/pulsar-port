import { z } from "zod";

export const appEnvironmentSchema = z.enum(["local", "preview", "production", "test"]);

export const healthDataSchema = z.object({
  service: z.literal("pulsar-port-api"),
  status: z.literal("ok"),
  environment: appEnvironmentSchema,
  version: z.string().min(1),
  timestamp: z.iso.datetime(),
});

export const healthResponseSchema = z.object({
  success: z.literal(true),
  data: healthDataSchema,
});

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string().min(1),
    message: z.string().min(1),
    requestId: z.string().uuid(),
    details: z.unknown().optional(),
  }),
});

export const paginationMetaSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type HealthData = z.infer<typeof healthDataSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type PaginatedApiSuccess<T> = ApiSuccess<T[]> & {
  pagination: PaginationMeta;
};
