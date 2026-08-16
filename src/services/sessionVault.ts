import type { AuthSession } from "../types/api";

const SESSION_KEY = "auth-session";
const WEB_STORAGE_KEY = "pulsar-port.auth-session";
const VAULT_CLIENT_NAME = "pulsar-port-auth";
const VAULT_PASSWORD = "pulsar-port-local-session-v1";

type StrongholdContext = {
  stronghold: import("@tauri-apps/plugin-stronghold").Stronghold;
  store: ReturnType<import("@tauri-apps/plugin-stronghold").Client["getStore"]>;
};

async function openStronghold(): Promise<StrongholdContext | null> {
  try {
    const [{ appDataDir }, { Stronghold }] = await Promise.all([
      import("@tauri-apps/api/path"),
      import("@tauri-apps/plugin-stronghold"),
    ]);
    const vaultPath = `${await appDataDir()}session-vault.hold`;
    const stronghold = await Stronghold.load(vaultPath, VAULT_PASSWORD);
    let client;

    try {
      client = await stronghold.loadClient(VAULT_CLIENT_NAME);
    } catch {
      client = await stronghold.createClient(VAULT_CLIENT_NAME);
    }

    return { stronghold, store: client.getStore() };
  } catch {
    return null;
  }
}

export async function loadStoredSession(): Promise<AuthSession | null> {
  const context = await openStronghold();
  if (context) {
    const data = await context.store.get(SESSION_KEY);
    if (!data) return null;

    try {
      return JSON.parse(new TextDecoder().decode(new Uint8Array(data))) as AuthSession;
    } catch {
      return null;
    }
  }

  const raw = localStorage.getItem(WEB_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export async function saveStoredSession(session: AuthSession): Promise<void> {
  const context = await openStronghold();
  if (context) {
    const data = Array.from(new TextEncoder().encode(JSON.stringify(session)));
    await context.store.insert(SESSION_KEY, data);
    await context.stronghold.save();
    return;
  }

  localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(session));
}

export async function clearStoredSession(): Promise<void> {
  const context = await openStronghold();
  if (context) {
    await context.store.remove(SESSION_KEY);
    await context.stronghold.save();
  }
  localStorage.removeItem(WEB_STORAGE_KEY);
}
