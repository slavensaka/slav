import type { KontrolnaTocka } from '../types';
import rawData from '../../../kontrolne_tocke.json';

// Process raw JSON data and add podrucjeId
export const kontrolneTocke: KontrolnaTocka[] = (rawData as Array<{
  id: string;
  naziv: string;
  lat: number;
  lng: number;
}>).map(item => ({
  ...item,
  podrucjeId: parseInt(item.id.split('.')[0], 10),
}));

export const getKontrolneTockeByPodrucje = (podrucjeId: number): KontrolnaTocka[] => {
  return kontrolneTocke.filter(kt => kt.podrucjeId === podrucjeId);
};

export const searchKontrolneTocke = (term: string): KontrolnaTocka[] => {
  const lowerTerm = term.toLowerCase();
  return kontrolneTocke.filter(kt =>
    kt.naziv.toLowerCase().includes(lowerTerm) ||
    kt.id.includes(term)
  );
};

export const getKontrolnaTockaById = (id: string): KontrolnaTocka | undefined => {
  return kontrolneTocke.find(kt => kt.id === id);
};
