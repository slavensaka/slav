# Obilaznica

Interaktivna web-aplikacija za praćenje kontrolnih točaka Hrvatskog planinarskog saveza (HPO). Prikazuje sve planinske vrhove i kontrolne točke na karti Hrvatske s mogućnošću filtriranja i praćenja posjećenosti.

## Što je HPO obilaznica?

HPO (Hrvatska planinska obilaznica) je sustav kontrolnih točaka razasutih po svim planinama Hrvatske. Planinari skupljaju potpise ili pečate na svakoj točki kako bi dokazali posjet. Ova aplikacija omogućuje vizualno praćenje napretka kroz sve regije.

## Značajke

- **Interaktivna karta** — Leaflet karta s klasteriranim markerima po regijama
- **Pretraga i filtriranje** — po regiji, imenu, ID-u, ili statusu posjećenosti
- **20 planinarskih regija** — od Slavonije do Dubrovačkog primorja, svaka u svojoj boji
- **~380 kontrolnih točaka** — s koordinatama, statusom i linkom na HPO portal
- **Responzivni dizajn** — radi na mobitelu i desktopu

## Tehnologije

| Sloj | Tehnologija |
|------|-------------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 7 |
| Stilizacija | Tailwind CSS 4 |
| Karta | Leaflet + react-leaflet + MarkerCluster |
| Animacije | Framer Motion |
| Ikone | Lucide React |
| Package manager | pnpm |

## Pokretanje

```bash
cd app
pnpm install
pnpm dev
```

Aplikacija se pokreće na `http://localhost:5173`.

## Struktura projekta

```
app/
├── src/
│   ├── components/
│   │   ├── MapView.tsx      # Leaflet karta s markerima
│   │   ├── Sidebar.tsx      # Bočna traka s filterima i listom
│   │   └── PopupCard.tsx    # Popup kartica kontrolne točke
│   ├── data/
│   │   ├── kontrolneTocke.ts  # Podaci o kontrolnim točkama
│   │   └── podrucja.ts        # Definicije planinarskih regija
│   ├── types/index.ts       # TypeScript tipovi
│   ├── App.tsx
│   └── main.tsx
├── kontrolne_tocke.json     # Izvorni podaci (JSON)
└── index.html
```

## Podaci

Kontrolne točke su pohranjene u `kontrolne_tocke.json` (korijenski direktorij) i učitane u `src/data/kontrolneTocke.ts`. Svaka točka sadrži:

```ts
{
  id: string;          // npr. "1.1" (regija.redni_broj)
  naziv: string;       // Puni naziv vrha/točke
  lat: number;
  lng: number;
  posjecen: boolean;   // Je li točka posjećena
  linkVanjski: string; // Link na HPO portal
}
```

## Praćenje napretka

Status posjećenosti može se mijenjati direktno u UI-ju (klik na ikonu pokraj vrha u menuju). Stanje se uvijek sprema u `localStorage` (offline cache), a ovisno o statusu prijave:

- **Ulogiran korisnik** — stanje se sprema na njegov račun u **Cloudflare D1** bazu i sinkronizira na svim uređajima. Sesija traje **40 dana** od prijave (token u localStorage), nakon čega je korisnik automatski odjavljen. Na prvi login postojeće lokalno stanje automatski se migrira na račun (union).
- **Neulogiran korisnik** — stanje ostaje samo u `localStorage` tog preglednika.

### Korisnički računi

- MVP: **email + lozinka** (registracija u appu, gumb s ikonom korisnika dolje desno)
- Planirano: **Google login** (OAuth)
- Backend: Cloudflare Worker + D1 (`worker/` direktorij) — tablice `users`, `sessions`, `user_tocke` (per-user stanje: posjećen, datum, bilješka…)

Za trajnu promjenu u izvornom kodu (npr. ažuriranje defaultnih vrijednosti), uredi `app/kontrolne_tocke.json` i napravi commit.

## Deploy na produkciju

Produkcija se nalazi na [https://obilaznica.slav.hr](https://obilaznica.slav.hr).

**Arhitektura:**

| Sloj | Servis |
|------|--------|
| CDN / DNS | Cloudflare (proxy ispred, `cache-control: s-maxage=300`) |
| Hosting statičnog builda | **Render.com** (potvrđeno `rndr-id` headerom) |
| Auth/sync backend | Cloudflare Worker: **https://obilaznica-sync.slavensakacic.workers.dev** |
| Baza podataka | Cloudflare D1 `obilaznica-db` (regija EEUR, id `7c5e1cae-9ece-46ce-bce5-f2d4ed8efea6`) |

Deploy statičnog sitea ide preko **Renderove native GitHub integracije** — Render je spojen direktno na `github.com/slavensaka/slav` i sam gradi/deploya na push na `develop` granu. **Nema committanog `.github/workflows/` fajla** — CI konfiguracija živi u Render dashboardu, ne u repou.

### Workflow za deploy

```bash
# 1. Napravi promjene lokalno

# 2. Provjeri da build prolazi
cd app
pnpm build

# 3. Commitaj promjene
git add <datoteke>
git commit -m "Opis promjena"

# 4. Puši na develop → Render automatski detektira push i deploya
git push origin develop
```

### Worker + D1 (odvojen deploy)

Backend je **postavljen i live** (19. 7. 2026.):

- Worker: `https://obilaznica-sync.slavensakacic.workers.dev`
- D1 baza: `obilaznica-db` (EEUR), `database_id` je u `worker/wrangler.toml`
- Schema (`users`, `sessions`, `user_tocke`) primijenjena iz `worker/schema.sql`
- Cloudflare račun: slavensakacic@gmail.com (wrangler OAuth login na ovom računalu)

Promjene Workera ili scheme deployaju se ručno:

```bash
cd obilaznica/worker

# Promjena koda
npx wrangler deploy

# Promjena scheme (migracije)
npx wrangler d1 execute obilaznica-db --remote --file=schema.sql

# Uvid u produkcijsku bazu
npx wrangler d1 execute obilaznica-db --remote --command "SELECT email, created_at FROM users"

# Live logovi
npx wrangler tail obilaznica-sync --format pretty
```

Endpointi: `/auth/register|login|logout|me` i `/tocke` (GET, `PUT /tocke/:id`, `POST /tocke/bulk`) — sve uz `Authorization: Bearer <token>`.

### ⚠️ Render env var (potrebno za produkcijski frontend)

Da bi login radio na https://obilaznica.slav.hr, u **Render dashboardu** (Environment) mora biti postavljeno:

```
VITE_SYNC_WORKER_URL=https://obilaznica-sync.slavensakacic.workers.dev
```

i zatim redeploy (Vite env se ugrađuje u build). Bez toga produkcijski app nema backend i prikazuje se bez prijave.

### Lokalni razvoj (backend)

```bash
# Terminal 1 — Worker s lokalnom D1 (SQLite u .wrangler/)
cd obilaznica/worker
npx wrangler d1 execute obilaznica-db --local --file=schema.sql   # prvi put
npx wrangler dev --local --port 8787

# Terminal 2 — frontend (čita .env.local → http://127.0.0.1:8787)
cd obilaznica/app
pnpm dev
```

Lokalna i produkcijska baza su odvojene — račune treba registrirati u svakoj posebno.

### Ažuriranje kontrolnih točaka

Kontrolne točke su pohranjene u `app/kontrolne_tocke.json`.
Kad dodaješ/uklanjavaš/mijenjavaš točke, commitaj i puši tu datoteku:

```bash
# Uredi app/kontrolne_tocke.json
git add app/kontrolne_tocke.json
git commit -m "Ažuriraj kontrolne točke: <opis>"
git push origin develop
```

> **Napomena:** Lokalne promjene napravljene u UI-ju (localStorage) **nisu** dio koda i neće biti na produkciji. Za trajne promjene statusu posjećenosti uredi JSON i deployi.
