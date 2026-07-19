// Auth prema Obilaznica Workeru (D1).
// Token živi u localStorage → korisnik ostaje trajno ulogiran.

import { useCallback, useEffect, useState } from 'react';

const API_URL = (import.meta.env.VITE_SYNC_WORKER_URL as string) ?? '';
const TOKEN_KEY = 'obilaznica-auth-token';
const EMAIL_KEY = 'obilaznica-auth-email';

export const authEnabled = !!API_URL;

export interface UserTockaState {
  tocka_id: string;
  posjecen: number;          // 0 | 1 (SQLite)
  posjecen_at: string | null;
  biljeska: string | null;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    signal: AbortSignal.timeout(8000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return data as T;
}

// ── API pozivi ──

export async function apiRegister(email: string, password: string): Promise<void> {
  const { token, email: em } = await api<{ token: string; email: string }>(
    '/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) },
  );
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, em);
}

export async function apiLogin(email: string, password: string): Promise<void> {
  const { token, email: em } = await api<{ token: string; email: string }>(
    '/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) },
  );
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, em);
}

export async function apiLogout(): Promise<void> {
  try { await api('/auth/logout', { method: 'POST' }); } catch { /* svejedno očisti */ }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export async function fetchUserTocke(): Promise<UserTockaState[]> {
  return api<UserTockaState[]>('/tocke');
}

export async function saveTocka(id: string, state: { posjecen?: boolean; biljeska?: string }): Promise<void> {
  await api(`/tocke/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(state) });
}

export async function bulkMarkPosjecene(ids: string[]): Promise<void> {
  await api('/tocke/bulk', { method: 'POST', body: JSON.stringify({ posjeceni: ids }) });
}

// ── Hook ──

export function useAuth() {
  const [email, setEmail] = useState<string | null>(() =>
    getToken() ? localStorage.getItem(EMAIL_KEY) : null,
  );

  // Provjeri da je token još valjan (npr. obrisan server-side)
  useEffect(() => {
    if (!authEnabled || !getToken()) return;
    api<{ email: string }>('/auth/me')
      .then((me) => setEmail(me.email))
      .catch((e: Error) => {
        if (e.message === 'Unauthorized') {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(EMAIL_KEY);
          setEmail(null);
        }
        // network greška → zadrži optimistično stanje
      });
  }, []);

  const login = useCallback(async (em: string, pw: string) => {
    await apiLogin(em, pw);
    setEmail(em.trim().toLowerCase());
  }, []);

  const register = useCallback(async (em: string, pw: string) => {
    await apiRegister(em, pw);
    setEmail(em.trim().toLowerCase());
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setEmail(null);
  }, []);

  return { email, loggedIn: email !== null, login, register, logout };
}
