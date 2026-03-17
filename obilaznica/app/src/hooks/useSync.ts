// Multi-device sync via Cloudflare Worker + KV
// UUID se čuva u localStorage, posjećeni vrhovi se sinkroniziraju

const SYNC_URL = (import.meta.env.VITE_SYNC_WORKER_URL as string) ?? '';
const UUID_KEY = 'obilaznica-sync-uuid';

export function getSyncUUID(): string {
  let uuid = localStorage.getItem(UUID_KEY);
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(UUID_KEY, uuid);
  }
  return uuid;
}

export function setSyncUUID(uuid: string): void {
  localStorage.setItem(UUID_KEY, uuid);
}

export async function fetchVisitedRemote(uuid: string): Promise<Set<string> | null> {
  if (!SYNC_URL) return null;
  try {
    const res = await fetch(`${SYNC_URL}/sync/${uuid}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const ids: string[] = await res.json();
    return new Set(ids);
  } catch {
    return null;
  }
}

export async function saveVisitedRemote(uuid: string, ids: Set<string>): Promise<void> {
  if (!SYNC_URL) return;
  try {
    await fetch(`${SYNC_URL}/sync/${uuid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([...ids]),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // silent fail — localStorage je primarna kopija
  }
}

export const syncEnabled = !!SYNC_URL;
