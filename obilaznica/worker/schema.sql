-- Obilaznica D1 schema
-- Pokreni: npx wrangler d1 execute obilaznica-db --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,      -- format: pbkdf2$<iteracije>$<salt_hex>$<hash_hex>
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,           -- 32 random bajta, hex
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),  -- sesija istječe 40 dana od kreiranja (SESSION_DAYS u index.js)
  last_seen_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- Per-user stanje kontrolne točke. Statični podaci vrha (naziv, koordinate...)
-- žive u kontrolne_tocke.json u appu — ovdje je samo korisnikovo stanje.
CREATE TABLE IF NOT EXISTS user_tocke (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tocka_id TEXT NOT NULL,           -- npr. "1.1"
  posjecen INTEGER NOT NULL DEFAULT 0,
  posjecen_at TEXT,                 -- kada je označeno posjećenim
  biljeska TEXT,                    -- buduće opcije: bilješka korisnika
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, tocka_id)
);
