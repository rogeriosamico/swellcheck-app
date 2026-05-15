import React from 'react';

const InfoBlock = ({ label, value, icon }) => (
  <div className="bg-[var(--surface-primary)] border border-[var(--border-primary)] p-4 rounded-[var(--radius-minimal)] flex-1 flex flex-col gap-1 min-w-0">
    <div className="flex items-start justify-between gap-2">
      <span className="text-token-subtitle text-[var(--text-secondary)] leading-tight">{label}</span>
      {icon && (
        <span className="text-[var(--text-primary)] flex items-center gap-1 shrink-0">
          {icon}
        </span>
      )}
    </div>
    <span className="text-token-body-bold text-[var(--text-primary)] leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{value}</span>
  </div>
);

export default InfoBlock;
