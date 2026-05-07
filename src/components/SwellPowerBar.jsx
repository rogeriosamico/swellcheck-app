import React from 'react';
import { cn } from "@/lib/utils";

const SwellPowerBar = ({ value, label, sublabel }) => {
  const segments = [1, 2, 3, 4, 5];

  // Cores do design system baseadas no valor (estado)
  const getColor = (segment) => {
    if (segment <= value) {
      // Determina a cor baseada no valor (estado)
      if (value >= 5) return "bg-[var(--surface-storm-solid)]"; // muito forte - vermelho
      if (value >= 3) return "bg-[var(--surface-bom-solid)]";    // bom ou forte - verde
      if (value >= 2) return "bg-[var(--surface-marola-solid)]"; // médio ou marola - amarelo
      if (value >= 1) return "bg-[var(--surface-flat-solid)]";   // fraco ou flat - marrom
    }
    return "bg-[var(--surface-terciary)]"; // inativo - cinza
  };

  return (
    <div className="bg-[var(--surface-primary)] border border-[var(--border-primary)] p-5 rounded-[var(--radius-minimal)] w-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-subtitle font-token-regular text-[var(--text-secondary)]">Força do swell</span>
        <div className="flex gap-2 items-baseline">
          <span className="text-body font-token-bold text-[var(--text-primary)]">{label}</span>
          <span className="text-subtitle font-token-regular text-[var(--text-secondary)]">· {sublabel}</span>
        </div>
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
