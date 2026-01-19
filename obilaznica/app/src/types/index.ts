export interface KontrolnaTocka {
  id: string;              // "1.1", "7.4"
  naziv: string;
  lat: number;
  lng: number;
  podrucjeId?: number;       // ekstrahirano iz id
  nadmorskaVisina?: number;  // u metrima
  tezina?: 'lako' | 'srednje' | 'tesko';
  opis?: string;
  slikaUrl?: string;         // URL slike
  linkVanjski?: string;      // vanjski link (npr. HPO)
  posjecen?: boolean;        // da li je vrh posjećen
}

export interface Podrucje {
  id: number;
  naziv: string;
  boja: string;
}

export interface MapState {
  selectedPodrucje: number | null;
  searchTerm: string;
  selectedTocka: KontrolnaTocka | null;
}
