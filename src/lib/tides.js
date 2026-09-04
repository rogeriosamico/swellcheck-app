export function parseTidePts(tides) {
  if (!tides || tides.length === 0) return [];
  // "high" é relativo ao próprio range do dia (ponto médio entre a menor e a maior
  // leitura), não um valor absoluto: a tábua BR usa datum do porto (sempre positivo,
  // ~0.3–2.1m — onde 1.2 caía perto do meio), mas países sem harbor usam maré do
  // Open-Meteo referenciada ao nível médio do mar (oscila em torno de 0, ex.: Holanda
  // -0.6 a 1.2m) — um limiar fixo de 1.2 classificaria a preamar real como "baixa" nesses
  // casos. Ver BEACHES.md, seção "Como cadastrar uma nova praia com perfil".
  const levels = tides.map(t => t.level);
  const midLevel = (Math.min(...levels) + Math.max(...levels)) / 2;
  return tides.map(t => {
    const [hr, mn] = t.hour.split(':').map(Number);
    return { hour: hr + mn / 60, level: t.level, high: t.level > midLevel };
  });
}

// Gaussian kernel interpolation — same algorithm used by TideChart.
export function interpolateTideLevel(tidePts, hour) {
  if (!tidePts || tidePts.length === 0) return null;
  let num = 0, den = 0;
  for (const p of tidePts) {
    const w = Math.exp(-Math.pow(hour - p.hour, 2) / 7);
    num += p.level * w;
    den += w;
  }
  return parseFloat((num / den).toFixed(2));
}

export function interpolateTideCurve(tidePts, steps = 96) {
  const curve = [];
  for (let i = 0; i <= steps; i++) {
    const h = (i / steps) * 24;
    curve.push({ hour: h, level: interpolateTideLevel(tidePts, h) });
  }
  return curve;
}
