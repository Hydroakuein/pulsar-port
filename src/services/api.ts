import type { Announcement, AnnouncementInput, AuthPayload } from "../types/api";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8787").replace(
  /\/$/,
  "",
);

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}, accessToken?: string): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError("無法連線至服務，請檢查網路或 API 設定", 0);
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(body?.error || `請求失敗（${response.status}）`, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    request<AuthPayload>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  refresh: (refreshToken: string) =>
    request<AuthPayload>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),
  logout: (accessToken: string) =>
    request<void>("/api/auth/logout", { method: "POST" }, accessToken),
};

export const announcementApi = {
  list: (accessToken: string) =>
    request<{ announcements: Announcement[] }>("/api/announcements", {}, accessToken),
  create: (input: AnnouncementInput, accessToken: string) =>
    request<{ announcement: Announcement }>(
      "/api/announcements",
      { method: "POST", body: JSON.stringify(input) },
      accessToken,
    ),
  update: (id: string, input: Partial<AnnouncementInput>, accessToken: string) =>
    request<{ announcement: Announcement }>(
      `/api/announcements/${id}`,
      { method: "PATCH", body: JSON.stringify(input) },
      accessToken,
    ),
  remove: (id: string, accessToken: string) =>
    request<void>(`/api/announcements/${id}`, { method: "DELETE" }, accessToken),
};
