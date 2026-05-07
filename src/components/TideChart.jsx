import React, { useMemo } from 'react';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

/**
 * Formats a decimal hour (e.g. 6.53) to "6:32am"
 */
function fmtTideHr(h) {
  const hr = Math.floor(h);
  const mn = Math.round((h - hr) * 60);
  const ampm = hr < 12 ? 'am' : 'pm';
  const disp = hr === 0 || hr === 24 ? 12 : hr > 12 ? hr - 12 : hr;
  return `${disp}:${mn < 10 ? '0' + mn : mn}${ampm}`;
}

/**
 * Generates an interpolated tide curve using Gaussian kernel smoothing.
 * Same algorithm as the one previously in App.jsx.
 */
function interpolateTideCurve(tidePts, steps = 96) {
  const curve = [];
  for (let i = 0; i <= steps; i++) {
    const h = (i / steps) * 24;
    let num = 0, den = 0;
    for (const p of tidePts) {
      const w = Math.exp(-Math.pow(h - p.hour, 2) / 7);
      num += p.level * w;
      den += w;
    }
    curve.push({
      hour: h,
      level: parseFloat((num / den).toFixed(2)),
    });
  }
  return curve;
}

const chartConfig = {
  level: {
    label: 'Nível (m)',
    color: 'var(--text-secondary)',
  },
};

/**
 * TideChart — Pure chart component (curve + dots + reference line only).
 *
 * This component renders ONLY the chart area. Title, time axis labels,
 * and container styling should be handled by the parent layout.
 *
 * @param {Object[]} tides       - Array of { hour: "06:32", level: 1.8 } from the API
 * @param {number}   currentHour - Decimal hour from the scrubber (e.g. 14.5 = 2:30pm)
 */
const TideChart = ({ tides, currentHour }) => {
  const tidePts = useMemo(() => {
    if (!tides || tides.length === 0) return [];
    return tides.map(t => {
      const [hr, mn] = t.hour.split(':').map(Number);
      return { hour: hr + mn / 60, level: t.level, high: t.level > 1.2 };
    });
  }, [tides]);

  const curveData = useMemo(() => {
    if (tidePts.length === 0) return [];
    return interpolateTideCurve(tidePts);
  }, [tidePts]);

  if (curveData.length === 0) return null;

  // Domain with padding so dots/labels at edges don't clip
  const levels = curveData.map(d => d.level);
  const minLevel = Math.min(...levels);
  const maxLevel = Math.max(...levels);
  const yPad = (maxLevel - minLevel) * 0.45; // Further increased padding for bottom labels

  return (
    <ChartContainer config={chartConfig} className="h-[120px] w-full aspect-auto">
      <AreaChart data={curveData} margin={{ top: 30, right: 0, bottom: 30, left: 0 }}>
        <defs>
          <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--text-secondary)" stopOpacity={0.12} />
            <stop offset="100%" stopColor="var(--text-secondary)" stopOpacity={0.01} />
          </linearGradient>
        </defs>

        <XAxis dataKey="hour" type="number" domain={[0, 24]} hide padding={{ left: 0, right: 0 }} />
        <YAxis domain={[minLevel - yPad, maxLevel + yPad]} hide />

        <Area
          dataKey="level"
          type="monotone"
          fill="url(#tideGradient)"
          stroke="var(--border-primary)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{
            r: 4,
            fill: 'var(--text-primary)',
            stroke: 'var(--surface-primary)',
            strokeWidth: 2,
          }}
          isAnimationActive={false}
        />

        <ChartTooltip
          cursor={true}
          content={
            <ChartTooltipContent
              hideLabel={false}
              labelFormatter={(_, payload) => {
                if (payload?.[0]?.payload) {
                  return fmtTideHr(payload[0].payload.hour);
                }
                return '';
              }}
              formatter={(value) => [`${value}m`, 'Nível']}
            />
          }
        />

        {/* Tide point markers with time labels */}
        {tidePts.map((p, i) => (
          <ReferenceDot
            key={i}
            x={p.hour}
            y={p.level}
            r={3}
            fill="var(--text-secondary)"
            stroke="var(--surface-primary)"
            strokeWidth={2}
            label={{
              value: fmtTideHr(p.hour),
              position: p.high ? 'top' : 'bottom',
              fontSize: 'var(--font-size-subtitle)',
              fill: 'var(--text-secondary)',
              fontFamily: 'var(--font-family)',
              offset: 12,
            }}
          />
        ))}

        {/* Current hour indicator (dashed vertical line) */}
        {currentHour !== undefined && currentHour !== null && (
          <ReferenceLine
            x={Math.min(Math.max(currentHour, 0), 24)}
            stroke="var(--text-primary)"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
        )}
      </AreaChart>
    </ChartContainer>
  );
};

export default TideChart;
