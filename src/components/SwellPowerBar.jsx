import React from 'react';
import { cn } from "@/lib/utils";

const SEGMENT_COLOR = {
  5: "bg-[var(--surface-storm-solid)]",
  4: "bg-[var(--surface-bom-solid)]",
  3: "bg-[var(--surface-bom-solid)]",
  2: "bg-[var(--surface-marola-solid)]",
  1: "bg-[var(--surface-flat-solid)]",
};

const SwellPowerBar = ({ value, label }) => {
  const segments = [1, 2, 3, 4, 5];

  const getColor = (segment) =>
    segment <= value ? SEGMENT_COLOR[value] : "bg-[var(--surface-terciary)]";

  return (
    <div className="bg-[var(--surface-primary)] border border-[var(--border-primary)] p-5 rounded-[var(--radius-minimal)] w-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-subtitle font-token-regular text-[var(--text-secondary)]">Força do swell</span>
        <span className="text-body font-token-bold text-[var(--text-primary)]">{label}</span>
      </div>
      <div className="flex gap-2">
        {segments.map((s) => (
          <div
            key={s}
            className={cn(
              "h-2 flex-1 rounded-full",
              getColor(s)
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default SwellPowerBar;
