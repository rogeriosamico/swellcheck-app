import React from 'react';

const InfoBlock = ({ label, value }) => (
  <div className="bg-[var(--surface-primary)] border border-[var(--border-primary)] p-4 rounded-[var(--radius-minimal)] flex-1 flex flex-col gap-1 min-w-0">
    <span className="text-subtitle text-[var(--text-secondary)] leading-tight font-token-regular">{label}</span>
    <span className="text-body font-token-bold text-[var(--text-primary)] leading-tight whitespace-nowrap overflow-hidden text-overflow-ellipsis">{value}</span>
  </div>
);

export default InfoBlock;
