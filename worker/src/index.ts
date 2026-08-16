import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Env = {
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY: string;
  ALLOWED_ORIGIN: string;
};

type AppRole = "member" | "admin";
type AnnouncementCategory = "announcement" | "release";

type AuthContext = {
  token: string;
  userId: string;
  email: string | null;
  role: AppRole;
  supabase: SupabaseClient;
};

type AnnouncementInput = {
  title?: unknown;
  content?: unknown;
  category?: unknown;
  version?: unknown;
  pinned?: unknown;
  published?: unknown;
};

const jsonHeaders = { "Content-Type": "application/json; charset=utf-8" };

function corsHeaders(env: Env): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(env: Env, body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { ...jsonHeaders, ...corsHeaders(env) },
  });
}

function noContent(env: Env): Response {
  return new Response(null, { status: 204, headers: corsHeaders(env) });
}

function createSupabase(env: Env, accessToken?: string): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  });
}

async function parseBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) throw new Error("請使用 JSON 格式");
  return (await request.json()) as Record<string, unknown>;
}

function readBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice(7).trim() || null;
}

async function authenticate(request: Request, env: Env): Promise<AuthContext | null> {
  const token = readBearerToken(request);
  if (!token) return null;

  return authenticateToken(token, env);
}

async function authenticateToken(token: string, env: Env): Promise<AuthContext | null> {
  const supabase = createSupabase(env, token);
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
  const claims = claimsData?.claims;
  const userId = claims?.sub;
  if (claimsError || typeof userId !== "string") return null;

  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle<{ role: AppRole }>();

  if (roleError) throw roleError;

  return {
    token,
    userId,
    email: typeof claims?.email === "string" ? claims.email : null,
    role: roleData?.role ?? "member",
    supabase,
  };
}

function validateAnnouncement(input: AnnouncementInput, partial = false) {
  const result: Record<string, string | boolean | null> = {};

  if (!partial || input.title !== undefined) {
    if (typeof input.title !== "string" || !input.title.trim() || input.title.length > 120) {
      throw new Error("標題必須是 1 到 120 個字元");
    }
    result.title = input.title.trim();
  }

  if (!partial || input.content !== undefined) {
    if (
      typeof input.content !== "string" ||
      !input.content.trim() ||
      input.content.length > 10000
    ) {
      throw new Error("內容必須是 1 到 10000 個字元");
    }
    result.content = input.content.trim();
  }

  if (!partial || input.category !== undefined) {
    if (input.category !== "announcement" && input.category !== "release") {
      throw new Error("分類必須是 announcement 或 release");
    }
    result.category = input.category as AnnouncementCategory;
  }

  if (input.version !== undefined) {
    if (
      input.version !== null &&
      (typeof input.version !== "string" || input.version.length > 32)
    ) {
      throw new Error("版本號不可超過 32 個字元");
    }
    result.version = typeof input.version === "string" ? input.version.trim() || null : null;
  }

  for (const key of ["pinned", "published"] as const) {
    if (input[key] !== undefined) {
      if (typeof input[key] !== "boolean") throw new Error(`${key} 必須是布林值`);
      result[key] = input[key];
    }
  }

  if (input.published === true) result.published_at = new Date().toISOString();
  if (input.published === false) result.published_at = null;

  return result;
}

async function handleLogin(request: Request, env: Env): Promise<Response> {
  const body = await parseBody(request);
  if (typeof body.email !== "string" || typeof body.password !== "string") {
    return json(env, { error: "請輸入 Email 與密碼" }, 400);
  }

  const supabase = createSupabase(env);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });

  if (error || !data.session) return json(env, { error: "Email 或密碼錯誤" }, 401);

  const auth = await authenticateToken(data.session.access_token, env);

  return json(env, {
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at ?? null,
    },
    user: {
      id: data.user.id,
      email: data.user.email ?? null,
      role: auth?.role ?? "member",
    },
  });
}

async function handleRefresh(request: Request, env: Env): Promise<Response> {
  const body = await parseBody(request);
  if (typeof body.refreshToken !== "string" || !body.refreshToken) {
    return json(env, { error: "缺少 refresh token" }, 400);
  }

  const supabase = createSupabase(env);
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: body.refreshToken });
  if (error || !data.session || !data.user) return json(env, { error: "登入已失效" }, 401);

  const auth = await authenticateToken(data.session.access_token, env);

  return json(env, {
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at ?? null,
    },
    user: {
      id: data.user.id,
      email: data.user.email ?? null,
      role: auth?.role ?? "member",
    },
  });
}

async function handleAnnouncements(
  request: Request,
  env: Env,
  auth: AuthContext,
): Promise<Response> {
  const url = new URL(request.url);
  const id = url.pathname.match(/^\/api\/announcements\/([0-9a-f-]+)$/i)?.[1];

  if (request.method === "GET" && !id) {
    let query = auth.supabase
      .from("announcements")
      .select(
        "id,title,content,category,version,pinned,published,published_at,created_at,updated_at",
      )
      .order("pinned", { ascending: false })
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (auth.role !== "admin") query = query.eq("published", true);
    const { data, error } = await query;
    if (error) throw error;
    return json(env, { announcements: data, role: auth.role });
  }

  if (auth.role !== "admin") return json(env, { error: "沒有管理權限" }, 403);

  if (request.method === "POST" && !id) {
    const input = validateAnnouncement(await parseBody(request));
    const { data, error } = await auth.supabase
      .from("announcements")
      .insert({ ...input, created_by: auth.userId })
      .select()
      .single();
    if (error) throw error;
    return json(env, { announcement: data }, 201);
  }

  if (request.method === "PATCH" && id) {
    const input = validateAnnouncement(await parseBody(request), true);
    const { data, error } = await auth.supabase
      .from("announcements")
      .update(input)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return json(env, { announcement: data });
  }

  if (request.method === "DELETE" && id) {
    const { error } = await auth.supabase.from("announcements").delete().eq("id", id);
    if (error) throw error;
    return noContent(env);
  }

  return json(env, { error: "找不到 API" }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return noContent(env);

    try {
      const url = new URL(request.url);

      if (request.method === "GET" && url.pathname === "/api/health") {
        return json(env, { ok: true });
      }
      if (request.method === "POST" && url.pathname === "/api/auth/login") {
        return await handleLogin(request, env);
      }
      if (request.method === "POST" && url.pathname === "/api/auth/refresh") {
        return await handleRefresh(request, env);
      }

      const auth = await authenticate(request, env);
      if (!auth) return json(env, { error: "請先登入" }, 401);

      if (request.method === "GET" && url.pathname === "/api/auth/me") {
        return json(env, { user: { id: auth.userId, email: auth.email, role: auth.role } });
      }
      if (request.method === "POST" && url.pathname === "/api/auth/logout") {
        await auth.supabase.auth.signOut();
        return noContent(env);
      }
      if (url.pathname === "/api/announcements" || url.pathname.startsWith("/api/announcements/")) {
        return await handleAnnouncements(request, env, auth);
      }

      return json(env, { error: "找不到 API" }, 404);
    } catch (error) {
      const message = error instanceof Error ? error.message : "伺服器發生錯誤";
      return json(env, { error: message }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
