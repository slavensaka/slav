import type { Podrucje } from '../types';

export const podrucja: Podrucje[] = [
  { id: 1, naziv: "Slavonija", boja: "#e74c3c" },
  { id: 2, naziv: "Bilogora i Moslavina", boja: "#3498db" },
  { id: 3, naziv: "Zagorje", boja: "#2ecc71" },
  { id: 4, naziv: "Medvednica", boja: "#9b59b6" },
  { id: 5, naziv: "Samoborsko gorje", boja: "#f39c12" },
  { id: 6, naziv: "Žumberak", boja: "#1abc9c" },
  { id: 7, naziv: "Karlovačko Pokuplje, Kordun i Banovina", boja: "#e67e22" },
  { id: 8, naziv: "Gorski kotar", boja: "#34495e" },
  { id: 9, naziv: "Primorje i Gorski kotar - istok", boja: "#16a085" },
  { id: 10, naziv: "Ćićarija i Učka", boja: "#27ae60" },
  { id: 11, naziv: "Sjeverni Velebit", boja: "#2980b9" },
  { id: 12, naziv: "Srednji Velebit", boja: "#8e44ad" },
  { id: 13, naziv: "Južni Velebit i Paklenica", boja: "#c0392b" },
  { id: 14, naziv: "Lička visoravan", boja: "#d35400" },
  { id: 15, naziv: "Kvarnerski otoci", boja: "#00bcd4" },
  { id: 16, naziv: "Dalmatinski otoci", boja: "#03a9f4" },
  { id: 17, naziv: "Dinara i Svilaja", boja: "#ff5722" },
  { id: 18, naziv: "Kozjak i Mosor", boja: "#795548" },
  { id: 19, naziv: "Biokovo", boja: "#607d8b" },
  { id: 20, naziv: "Dubrovačko primorje", boja: "#ff9800" },
  { id: 21, naziv: "Dodatno", boja: "#9c27b0" },
];

export const getPodrucjeById = (id: number): Podrucje | undefined => {
  return podrucja.find(p => p.id === id);
};

export const getPodrucjeByTockaId = (tockaId: string): Podrucje | undefined => {
  const podrucjeId = parseInt(tockaId.split('.')[0], 10);
  return getPodrucjeById(podrucjeId);
};
