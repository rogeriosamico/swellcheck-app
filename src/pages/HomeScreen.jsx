import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import { HomeCardSkeleton } from "@/components/Skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BeachCard from "@/components/BeachCard";
import DateFilterModal from "@/components/DateFilterModal";
import { BEACHES, BEACHES_META, CONDITIONS, COND_DESCS, COND_ORDER } from "@/lib/constants";
import { fetchForecastAll } from "@/lib/api";
import { getToday, parseDateLabel } from "@/lib/dates";

export default function HomeScreen() {
  const navigate = useNavigate();
  const currentHour = new Date().getHours();
  const todayIso = getToday();

  const [query, setQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState(todayIso);
  const [goodBeaches, setGoodBeaches] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    setListLoading(true);
    setGoodBeaches([]);
    fetchForecastAll(selectedDay)
      .then(beaches => {
        const sorted = [...beaches].sort((a, b) => (COND_ORDER[a.cond] ?? 99) - (COND_ORDER[b.cond] ?? 99));
        setGoodBeaches(sorted);
        setListLoading(false);
      })
      .catch(() => setListLoading(false));
  }, [selectedDay]);

  const filtered = query.trim()
    ? goodBeaches.filter(b => b.beach.toLowerCase().includes(query.trim().toLowerCase()))
    : goodBeaches;

  const goToBeach = (beachName) => {
    const slug = BEACHES_META[beachName]?.slug;
    if (!slug) return;
    const params = selectedDay !== todayIso ? `?data=${selectedDay}` : "";
    navigate(`/praia/${slug}${params}`);
  };

  return (
    <div style={{ width: "100%", maxWidth: 680, margin: "0 auto", padding: "40px 16px 80px" }}>
      <Header variant="default" />

      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <div style={{ display: "flex", gap: "var(--spacing-sm)", marginBottom: 10 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", zIndex: 1 }} />
            <Input
              type="text"
              placeholder="Buscar praia..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Buscar praia"
              className="pl-11 h-12"
              style={{ borderRadius: "var(--radius-minimal)" }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Limpar busca"
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: "var(--font-size-headline)", lineHeight: 1, padding: 4 }}
              >
                ×
              </button>
            )}
          </div>

          <DateFilterModal
            initialDate={selectedDay}
            onApply={day => setSelectedDay(day)}
            trigger={
              <Button aria-label="Filtrar por data" size="xl">
                Filtrar por data
              </Button>
            }
          />
        </div>
        <div style={{ fontSize: "var(--font-size-body)", color: "var(--text-secondary)" }}>
          Exibindo resultados para:{" "}
          <span style={{ color: "var(--text-primary)", fontWeight: "var(--font-weight-bold)" }}>
            {parseDateLabel(selectedDay)}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
        {listLoading
          ? BEACHES.map((_, i) => <HomeCardSkeleton key={i} />)
          : filtered.length === 0
            ? <div style={{ fontSize: "var(--font-size-body)", color: "var(--text-secondary)", padding: "24px 0" }}>Nenhuma praia encontrada.</div>
            : filtered.map(b => {
              const c = CONDITIONS[b.cond];
              const meta = BEACHES_META[b.beach];
              const h = b.hours?.[currentHour];
              return (
                <BeachCard
                  key={b.beach}
                  name={b.beach}
                  state={meta?.state}
                  country={meta?.country}
                  height={h?.height}
                  condition={b.cond}
                  label={c.label}
                  onClick={() => goToBeach(b.beach)}
                />
              );
            })
        }
      </div>

      <div style={{ marginTop: 48 }}>
        <div style={{ height: 1, background: "var(--border-primary)", marginBottom: "var(--spacing-md)" }} />
        <div style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap" }}>
          {Object.entries(CONDITIONS).map(([key, c]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
              <span style={{ fontSize: "var(--font-size-subtitle)", color: "var(--text-secondary)" }}>
                {c.label} — {COND_DESCS[key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
