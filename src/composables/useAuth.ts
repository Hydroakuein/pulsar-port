import { computed, reactive } from "vue";

import { authApi } from "../services/api";
import { clearStoredSession, loadStoredSession, saveStoredSession } from "../services/sessionVault";
import type { AuthSession, AuthUser } from "../types/api";

const state = reactive<{
  initialized: boolean;
  loading: boolean;
  user: AuthUser | null;
  session: AuthSession | null;
}>({
  initialized: false,
  loading: false,
  user: null,
  session: null,
});

let initialization: Promise<void> | null = null;
let persistenceQueue: Promise<void> = Promise.resolve();

function queuePersistence(task: () => Promise<void>) {
  persistenceQueue = persistenceQueue.then(task, task).catch(() => undefined);
}

function applyAuth(payload: { session: AuthSession; user: AuthUser }) {
  state.session = payload.session;
  state.user = payload.user;
  queuePersistence(() => saveStoredSession(payload.session));
}

export function initializeAuth(): Promise<void> {
  if (state.initialized) return Promise.resolve();
  if (initialization) return initialization;

  initialization = (async () => {
    state.loading = true;
    try {
      const stored = await loadStoredSession();
      if (stored?.refreshToken) applyAuth(await authApi.refresh(stored.refreshToken));
    } catch {
      await clearStoredSession();
      state.session = null;
      state.user = null;
    } finally {
      state.loading = false;
      state.initialized = true;
    }
  })();

  return initialization;
}

async function login(email: string, password: string) {
  state.loading = true;
  try {
    applyAuth(await authApi.login(email, password));
  } finally {
    state.loading = false;
  }
}

function logout() {
  const accessToken = state.session?.accessToken;
  state.session = null;
  state.user = null;
  queuePersistence(clearStoredSession);

  if (accessToken) void authApi.logout(accessToken).catch(() => undefined);
}

async function getAccessToken(forceRefresh = false): Promise<string> {
  const session = state.session;
  if (!session) throw new Error("請先登入");

  const expiresSoon = session.expiresAt !== null && session.expiresAt * 1000 <= Date.now() + 30_000;
  if (!forceRefresh && !expiresSoon) return session.accessToken;

  applyAuth(await authApi.refresh(session.refreshToken));
  if (!state.session) throw new Error("登入已失效");
  return state.session.accessToken;
}

export function useAuth() {
  return {
    state,
    isAuthenticated: computed(() => Boolean(state.user && state.session)),
    isAdmin: computed(() => state.user?.role === "admin"),
    login,
    logout,
    getAccessToken,
  };
}
