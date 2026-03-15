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

Status posjećenosti (`posjecen`) se mijenja ručno u JSON datoteci. Zadnji commitovi bilježe napredak po regijama.
