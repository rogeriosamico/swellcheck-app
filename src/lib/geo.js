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
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.municipality ||
      data.address?.county;
    const stateCode = data.address?.["ISO3166-2-lvl4"]?.split("-")[1];
    if (city && stateCode) return `${city}, ${stateCode}`;
    return null;
  } catch {
    return null;
  }
}
