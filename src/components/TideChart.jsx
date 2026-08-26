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
import { parseTidePts, interpolateTideCurve } from '@/lib/tides';

function fmtTideHr(h) {
  const hr = Math.floor(h);
  const mn = Math.round((h - hr) * 60);
  const ampm = hr < 12 ? 'am' : 'pm';
  const disp = hr === 0 || hr === 24 ? 12 : hr > 12 ? hr - 12 : hr;
  return `${disp}:${mn < 10 ? '0' + mn : mn}${ampm}`;
}

// Renders a tide point label with smart textAnchor to avoid card edge overflow.
// Recharts 2.x passes viewBox as { x, y, width, height } centered on the dot.
function TidePointLabel({ viewBox, isHigh, hour, timeStr }) {
  if (!viewBox || viewBox.x == null) return null;
  const cx = viewBox.x + (viewBox.width ?? 0) / 2;
  const cy = viewBox.y + (viewBox.height ?? 0) / 2;

  const y = isHigh ? cy - 12 : cy + 12;
  // Adjust anchor near the left/right edges of the 0-24h axis
  const anchor = hour < 2 ? 'start' : hour > 22 ? 'end' : 'middle';

  return (
    <text
      x={cx}
      y={y}
      textAnchor={anchor}
      dominantBaseline={isHigh ? 'auto' : 'hanging'}
      fontSize={11}
      fontFamily="'Space Grotesk', sans-serif"
      fill="var(--text-secondary)"
    >
      {timeStr}
    </text>
  );
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
  const tidePts = useMemo(() => parseTidePts(tides), [tides]);

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
    <ChartContainer config={chartConfig} className="h-[120px] w-full aspect-auto [&_svg]:overflow-visible">
      <AreaChart data={curveData} margin={{ top: 16, right: 0, bottom: 16, left: 0 }}>
        <defs>
          <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--text-primary)" stopOpacity={0.20} />
            <stop offset="100%" stopColor="var(--text-primary)" stopOpacity={0.00} />
          </linearGradient>
        </defs>

        <XAxis dataKey="hour" type="number" domain={[0, 24]} hide padding={{ left: 0, right: 0 }} />
        <YAxis domain={[minLevel - yPad, maxLevel + yPad]} hide />

        <Area
          dataKey="level"
          type="monotone"
          baseValue={minLevel - yPad}
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
              content: (labelProps) => (
                <TidePointLabel
                  {...labelProps}
                  isHigh={p.high}
                  hour={p.hour}
                  timeStr={fmtTideHr(p.hour)}
                />
              ),
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
