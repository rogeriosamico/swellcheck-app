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
    const city = addr.city || addr.town || addr.municipality || addr.county;
    if (!city) return null;

    // BR usa admin level 4 (ISO3166-2-lvl4, ex. "BR-PE" → "PE"). Fora do Brasil o
    // nível administrativo equivalente muda (ex. distritos de Portugal são lvl6,
    // "PT-11") e o código costuma ser numérico, não uma sigla legível — nesse
    // caso cai pro nome por extenso (state/county) em vez de descartar a cidade.
    const isoCode = (addr["ISO3166-2-lvl4"] ?? addr["ISO3166-2-lvl6"])?.split("-")[1];
    const stateCode = isoCode && /^[A-Z]+$/.test(isoCode) ? isoCode : null;
    const region = stateCode || addr.state || addr.county;

    return region && region !== city ? `${city}, ${region}` : city;
  } catch {
    return null;
  }
}
