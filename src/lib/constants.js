export const BEACHES_META = {
  "Paiva":              { state: "PE", country: "Brasil", slug: "paiva",             lat: -8.3108,  lng: -34.9700 },
  "Itapuama":           { state: "PE", country: "Brasil", slug: "itapuama",          lat: -8.3989,  lng: -35.0286 },
  "Porto de Galinhas":  { state: "PE", country: "Brasil", slug: "porto-de-galinhas", lat: -8.5075,  lng: -35.0028 },
  "Maracaípe":          { state: "PE", country: "Brasil", slug: "maracaipe",         lat: -8.5328,  lng: -35.0072 },
  "Madeiro":            { state: "RN", country: "Brasil", slug: "madeiro",           lat: -6.2283,  lng: -35.0508 },
  "Baía Formosa":       { state: "RN", country: "Brasil", slug: "baia-formosa",      lat: -6.3728,  lng: -35.0089 },
  "Cacimba do Padre":   { state: "PE", country: "Brasil", slug: "cacimba-do-padre",  lat: -3.8397,  lng: -32.4203 },
  "Jericoacoara":       { state: "CE", country: "Brasil", slug: "jericoacoara",      lat: -2.7975,  lng: -40.5128 },
  "Tourinhos":          { state: "RN", country: "Brasil", slug: "tourinhos",         lat: -5.1089,  lng: -35.4908 },
  "Janga":              { state: "PE", country: "Brasil", slug: "janga",             lat: -7.9508,  lng: -34.8267 },
  "Olinda":             { state: "PE", country: "Brasil", slug: "olinda",            lat: -7.9908,  lng: -34.8416 },
  "Ponta Negra":        { state: "RN", country: "Brasil", slug: "ponta-negra",       lat: -5.8906,  lng: -35.1778 },
  "Praia do Francês":   { state: "AL", country: "Brasil", slug: "praia-do-frances",  lat: -9.6617,  lng: -35.8406 },
  "Japaratinga":        { state: "AL", country: "Brasil", slug: "japaratinga",       lat: -9.0839,  lng: -35.2489 },
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
