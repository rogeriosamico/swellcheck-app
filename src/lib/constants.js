export const BEACHES_META = {
  "Paiva":              { state: "PE", country: "Brasil", slug: "paiva" },
  "Itapuama":           { state: "PE", country: "Brasil", slug: "itapuama" },
  "Porto de Galinhas":  { state: "PE", country: "Brasil", slug: "porto-de-galinhas" },
  "Maracaípe":          { state: "PE", country: "Brasil", slug: "maracaipe" },
  "Madeiro":            { state: "RN", country: "Brasil", slug: "madeiro" },
  "Baía Formosa":       { state: "RN", country: "Brasil", slug: "baia-formosa" },
  "Cacimba do Padre":   { state: "PE", country: "Brasil", slug: "cacimba-do-padre" },
  "Jericoacoara":       { state: "CE", country: "Brasil", slug: "jericoacoara" },
  "Tourinhos":          { state: "RN", country: "Brasil", slug: "tourinhos" },
  "Janga":              { state: "PE", country: "Brasil", slug: "janga" },
  "Olinda":             { state: "PE", country: "Brasil", slug: "olinda" },
};

export const SLUG_TO_BEACH = Object.fromEntries(
  Object.entries(BEACHES_META).map(([name, meta]) => [meta.slug, name])
);

export const BEACHES = Object.keys(BEACHES_META);

export const CONDITIONS = {
  flat:  { label: "Flat",  color: "var(--text-flat)" },
  marola:{ label: "Marola",color: "var(--text-marola)" },
  bom:   { label: "Bom",   color: "var(--text-bom)" },
  storm: { label: "Storm", color: "var(--text-storm)" },
};

export const COND_DESCS = {
  flat:  "Não vale a pena",
  marola:"Vai depender",
  bom:   "Vai surfar!",
  storm: "Cuidado",
};

export const COND_ORDER = { storm: 0, bom: 1, marola: 2, flat: 3 };

export const SW_LABELS = ["Fraco", "Médio", "Bom", "Forte", "Muito forte"];
