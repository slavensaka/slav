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

