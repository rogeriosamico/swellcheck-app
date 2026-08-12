const CACHE_KEY = (date) => `ondina|forecast-all|${date}`;
const TTL_MS = 6 * 60 * 60 * 1000;

export function getCachedList(date) {
  try {
    const raw = localStorage.getItem(CACHE_KEY(date));
    if (!raw) return null;
    const { data, expiresAt } = JSON.parse(raw);
    return Date.now() < expiresAt ? data : null;
  } catch {
    return null;
  }
}

export function saveCachedList(date, beaches) {
  try {
    localStorage.setItem(
      CACHE_KEY(date),
      JSON.stringify({ data: beaches, expiresAt: Date.now() + TTL_MS })
    );
  } catch {}
}
