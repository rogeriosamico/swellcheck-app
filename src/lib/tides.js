export function parseTidePts(tides) {
  if (!tides || tides.length === 0) return [];
  return tides.map(t => {
    const [hr, mn] = t.hour.split(':').map(Number);
    return { hour: hr + mn / 60, level: t.level, high: t.level > 1.2 };
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
