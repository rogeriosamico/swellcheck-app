import React from "react";

export function SkeletonPulse({ width = "100%", height = 14, borderRadius = 6, style = {} }) {
  return (
    <div style={{
      width,
      height,
      borderRadius,
      background: "linear-gradient(90deg, var(--surface-terciary) 25%, var(--border-primary) 50%, var(--surface-terciary) 75%)",
      backgroundSize: "200% 100%",
      animation: "skeletonPulse 1.4s ease-in-out infinite",
      flexShrink: 0,
      ...style,
    }} />
  );
}

export function HomeCardSkeleton() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "var(--spacing-sm)",
      border: "1.5px solid var(--border-primary)",
      borderRadius: "var(--radius-rounded)",
      padding: "var(--spacing-md)",
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
        <SkeletonPulse width="55%" height={18} />
        <SkeletonPulse width="35%" height={12} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-xs)" }}>
        <SkeletonPulse width={40} height={10} />
        <SkeletonPulse width={40} height={20} />
      </div>
      <SkeletonPulse width={76} height={32} borderRadius={20} />
    </div>
  );
}

export function BeachDetailSkeleton() {
  return (
    <div style={{ border: "1.5px solid var(--border-primary)", borderRadius: "var(--radius-minimal)", padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--spacing-xs)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
          <SkeletonPulse width={110} height={36} borderRadius={8} />
          <SkeletonPulse width={160} height={12} />
        </div>
        <SkeletonPulse width={80} height={12} />
      </div>
      <div style={{ height: 1, background: "var(--border-primary)", margin: "20px 0" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-md)" }}>
        <SkeletonPulse width={120} height={16} />
        <SkeletonPulse width={56} height={22} borderRadius={20} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-sm)" }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ background: "var(--surface-terciary)", borderRadius: "var(--radius-minimal)", padding: "11px 12px", display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
            <SkeletonPulse width="50%" height={10} />
            <SkeletonPulse width="75%" height={14} />
          </div>
        ))}
      </div>
      <div style={{ background: "var(--surface-terciary)", borderRadius: "var(--radius-minimal)", padding: "11px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <SkeletonPulse width={80} height={10} />
          <SkeletonPulse width={60} height={12} />
        </div>
        <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
          {[0, 1, 2, 3, 4].map(i => <SkeletonPulse key={i} height={6} borderRadius={4} style={{ flex: 1 }} />)}
        </div>
      </div>
      <div style={{ height: 1, background: "var(--border-primary)", margin: "20px 0" }} />
      <SkeletonPulse width={40} height={10} style={{ marginBottom: 10 }} />
      <SkeletonPulse width="100%" height={90} borderRadius={8} style={{ marginBottom: "var(--spacing-sm)" }} />
      <SkeletonPulse width="100%" height={44} borderRadius={8} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--spacing-xs)" }}>
        {[0, 1, 2, 3, 4].map(i => <SkeletonPulse key={i} width={28} height={10} />)}
      </div>
    </div>
  );
}
