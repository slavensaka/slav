// Obilaznica Worker — auth + per-user stanje vrhova (D1)
//
// AUTH:
//   POST   /auth/register   {email, password}        → {token, email}
//   POST   /auth/login      {email, password}        → {token, email}
//   POST   /auth/logout     (Bearer)                 → {ok}
//   GET    /auth/me         (Bearer)                 → {email}
//
// TOCKE (Bearer):
//   GET    /tocke                                    → [{tocka_id, posjecen, posjecen_at, biljeska}]
//   PUT    /tocke/:id       {posjecen?, biljeska?}   → {ok}
//   POST   /tocke/bulk      {posjeceni: [id, ...]}   → {ok, count}  (migracija iz localStorage)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

const err = (message, status) => json({ error: message }, status);

// ── Crypto helpers (PBKDF2 — bcrypt nije dostupan u Workers runtimeu) ──

const PBKDF2_ITERATIONS = 100_000;

const toHex = (buf) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

const fromHex = (hex) =>
  new Uint8Array(hex.match(/.{2}/g).map((b) => parseInt(b, 16)));

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    256,
  );
  return toHex(bits);
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt)}$${hash}`;
}

async function verifyPassword(password, stored) {
  const [scheme, iterStr, saltHex, expected] = stored.split('$');
  if (scheme !== 'pbkdf2') return false;
  const actual = await pbkdf2(password, fromHex(saltHex), Number(iterStr));
  // Konstantno vrijeme nije kritično (hash je već spor), ali usporedi cijele stringove
  return actual === expected;
}

const newToken = () => toHex(crypto.getRandomValues(new Uint8Array(32)));

// ── Auth helpers ──

function bearerToken(request) {
  const h = request.headers.get('Authorization') ?? '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
}

// Sesija vrijedi 40 dana od logina; nakon toga korisnik je odjavljen.
const SESSION_DAYS = 40;

async function requireUser(request, env) {
  const token = bearerToken(request);
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  const row = await env.DB
    .prepare(`SELECT s.token, u.id AS user_id, u.email FROM sessions s JOIN users u ON u.id = s.user_id
              WHERE s.token = ? AND s.created_at > datetime('now', '-${SESSION_DAYS} days')`)
    .bind(token)
    .first();
  if (!row) {
    // Lazy cleanup isteklih sesija
    env.DB.prepare(`DELETE FROM sessions WHERE created_at <= datetime('now', '-${SESSION_DAYS} days')`)
      .run().catch(() => {});
    return null;
  }
  env.DB.prepare("UPDATE sessions SET last_seen_at = datetime('now') WHERE token = ?")
    .bind(token).run().catch(() => {});
  return row;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Handlers ──

async function handleAuth(request, env, parts) {
  const action = parts[1];

  if (action === 'me' && request.method === 'GET') {
    const user = await requireUser(request, env);
    if (!user) return err('Unauthorized', 401);
    return json({ email: user.email });
  }

  if (action === 'logout' && request.method === 'POST') {
    const token = bearerToken(request);
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return json({ ok: true });
  }

  if ((action === 'register' || action === 'login') && request.method === 'POST') {
    let body;
    try { body = await request.json(); } catch { return err('Invalid JSON', 400); }
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    if (!EMAIL_RE.test(email)) return err('Neispravan email', 400);
    if (password.length < 4) return err('Lozinka mora imati barem 4 znaka', 400);

    let userId;
    if (action === 'register') {
      const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
      if (existing) return err('Račun s tim emailom već postoji', 409);
      const hash = await hashPassword(password);
      const res = await env.DB
        .prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
        .bind(email, hash)
        .run();
      userId = res.meta.last_row_id;
    } else {
      const user = await env.DB
        .prepare('SELECT id, password_hash FROM users WHERE email = ?')
        .bind(email)
        .first();
      if (!user || !(await verifyPassword(password, user.password_hash))) {
        return err('Pogrešan email ili lozinka', 401);
      }
      userId = user.id;
    }

    const token = newToken();
    await env.DB.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').bind(token, userId).run();
    return json({ token, email });
  }

  return err('Not Found', 404);
}

async function handleTocke(request, env, parts) {
  const user = await requireUser(request, env);
  if (!user) return err('Unauthorized', 401);

  // GET /tocke — cijelo stanje korisnika
  if (!parts[1] && request.method === 'GET') {
    const { results } = await env.DB
      .prepare('SELECT tocka_id, posjecen, posjecen_at, biljeska FROM user_tocke WHERE user_id = ?')
      .bind(user.user_id)
      .all();
    return json(results);
  }

  // POST /tocke/bulk — migracija: označi listu ID-eva posjećenima
  if (parts[1] === 'bulk' && request.method === 'POST') {
    let body;
    try { body = await request.json(); } catch { return err('Invalid JSON', 400); }
    const ids = Array.isArray(body.posjeceni) ? body.posjeceni.filter((x) => typeof x === 'string') : null;
    if (!ids) return err('Expected {posjeceni: string[]}', 400);
    if (ids.length > 1000) return err('Too many IDs', 400);

    const stmt = env.DB.prepare(
      `INSERT INTO user_tocke (user_id, tocka_id, posjecen, posjecen_at)
       VALUES (?, ?, 1, datetime('now'))
       ON CONFLICT (user_id, tocka_id)
       DO UPDATE SET posjecen = 1, posjecen_at = COALESCE(posjecen_at, datetime('now')), updated_at = datetime('now')`,
    );
    if (ids.length > 0) {
      await env.DB.batch(ids.map((id) => stmt.bind(user.user_id, id)));
    }
    return json({ ok: true, count: ids.length });
  }

  // PUT /tocke/:id — upsert stanja jedne točke
  if (parts[1] && parts[1] !== 'bulk' && request.method === 'PUT') {
    const tockaId = decodeURIComponent(parts[1]);
    if (!/^[\d.]{1,10}$/.test(tockaId)) return err('Invalid tocka id', 400);
    let body;
    try { body = await request.json(); } catch { return err('Invalid JSON', 400); }

    const posjecen = body.posjecen === undefined ? null : (body.posjecen ? 1 : 0);
    const biljeska = body.biljeska === undefined ? null : String(body.biljeska).slice(0, 2000);

    await env.DB.prepare(
      `INSERT INTO user_tocke (user_id, tocka_id, posjecen, posjecen_at, biljeska)
       VALUES (?1, ?2, COALESCE(?3, 0), CASE WHEN ?3 = 1 THEN datetime('now') END, ?4)
       ON CONFLICT (user_id, tocka_id) DO UPDATE SET
         posjecen    = COALESCE(?3, posjecen),
         posjecen_at = CASE WHEN ?3 = 1 THEN COALESCE(posjecen_at, datetime('now'))
                            WHEN ?3 = 0 THEN NULL
                            ELSE posjecen_at END,
         biljeska    = COALESCE(?4, biljeska),
         updated_at  = datetime('now')`,
    ).bind(user.user_id, tockaId, posjecen, biljeska).run();

    return json({ ok: true });
  }

  return err('Not Found', 404);
}

// ── Router ──

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);

    try {
      switch (parts[0]) {
        case 'auth':  return await handleAuth(request, env, parts);
        case 'tocke': return await handleTocke(request, env, parts);
        default:      return err('Not Found', 404);
      }
    } catch (e) {
      console.error(e);
      return err('Internal error', 500);
    }
  },
};
