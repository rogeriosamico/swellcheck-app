const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";

export async function fetchForecastAll(date, signal) {
  const res = await fetch(`${API_BASE}/forecast-all?date=${date}`, { signal });
  if (!res.ok) throw new Error("Erro na API");
  return res.json();
}

export async function fetchForecast(beach, date) {
  const res = await fetch(`${API_BASE}/forecast?beach=${encodeURIComponent(beach)}&date=${date}`);
  if (!res.ok) throw new Error("Erro na API");
  return res.json();
}

export async function fetchTide(date, beach) {
  const res = await fetch(`${API_BASE}/tide?date=${date}&beach=${encodeURIComponent(beach)}`);
  if (!res.ok) throw new Error("Erro na API de maré");
  return res.json();
}
