const R = 6371;

export function haversineKm(lat1, lng1, lat2, lng2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "pt-BR" } }
    );
    const data = await res.json();
    const addr = data.address ?? {};
    // Ordem do assentamento mais específico pro mais genérico. Muita praia pelo
    // mundo só tem "village" (ex. Hossegor/França, North Shore/Havaí) — sem esse
    // fallback caía direto em municipality/county, que costuma ser um nome
    // administrativo grande e sem relação com o lugar real (ex. "Condado de
    // Honolulu" em vez do vilarejo onde a praia fica).
    const city =
      addr.city || addr.town || addr.village || addr.hamlet || addr.municipality || addr.county;
    if (!city) return null;

    // BR usa admin level 4 (ISO3166-2-lvl4, ex. "BR-PE" → "PE"). Fora do Brasil o
    // nível administrativo equivalente muda (ex. distritos de Portugal são lvl6,
    // "PT-11") e o código costuma ser numérico, não uma sigla legível — nesse
    // caso cai pro nome por extenso (state/province/county) em vez de descartar
    // a cidade. addr.province cobre países que não usam "state" (ex. Japão).
    const isoCode = (addr["ISO3166-2-lvl4"] ?? addr["ISO3166-2-lvl6"])?.split("-")[1];
    const stateCode = isoCode && /^[A-Z]+$/.test(isoCode) ? isoCode : null;
    const region = stateCode || addr.state || addr.province || addr.county;

    return region && region !== city ? `${city}, ${region}` : city;
  } catch {
    return null;
  }
}
