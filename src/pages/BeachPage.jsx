import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import { BeachDetailSkeleton } from "@/components/Skeleton";
import TideChart from "@/components/TideChart";
import TimeSlider from "@/components/TimeSlider";
import SwellPowerBar from "@/components/SwellPowerBar";
import InfoBlock from "@/components/InfoBlock";
import DateFilterModal from "@/components/DateFilterModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SLUG_TO_BEACH, CONDITIONS, SW_LABELS } from "@/lib/constants";
import { fetchForecast, fetchTide } from "@/lib/api";
import { getToday, getMaxDay, addDays, isValidDate, parseDateLabel, shortDateLabel, fmtHr } from "@/lib/dates";
import { swellSegs } from "@/lib/swell";

export default function BeachPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const beach = SLUG_TO_BEACH[slug];
  const todayIso = getToday();
  const maxIso = getMaxDay();
  const currentHour = new Date().getHours();

  const rawDate = searchParams.get("data");
  const pageDay = isValidDate(rawDate) ? rawDate : todayIso;

  const setPageDay = (day) => {
    if (day === todayIso) {
      setSearchParams({});
    } else {
      setSearchParams({ data: day });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [beachData, setBeachData] = useState(null);
  const [tideData, setTideData] = useState(null);
  const [tideError, setTideError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrubHour, setScrubHour] = useState(currentHour);

  useEffect(() => {
    if (!beach) navigate("/", { replace: true });
  }, [beach, navigate]);

  useEffect(() => {
    if (!beach) return;
    setLoading(true);
    setError(null);
    setBeachData(null);
    setTideData(null);
    setTideError(false);

    fetchForecast(beach, pageDay)
      .then(forecast => {
        setBeachData(forecast);
        setScrubHour(currentHour);
        setLoading(false);
      })
      .catch(() => {
        setError("Não foi possível carregar os dados.");
        setLoading(false);
      });

    fetchTide(pageDay, beach)
      .then(tide => setTideData(tide))
      .catch(() => setTideError(true));
  }, [beach, pageDay, currentHour]);

  if (!beach) return null;

  const safeHour = Math.min(Math.floor(scrubHour), 23);
  const hourData = beachData?.hours?.[safeHour];
  const dayCond = beachData?.cond;
  const condColor = dayCond ? CONDITIONS[dayCond]?.color : "var(--text-secondary)";

  return (
    <div style={{ width: "100%", maxWidth: 680, margin: "0 auto", padding: "0 0 80px" }}>
      <Header
        variant="beach"
        title={beach}
        onBack={() => navigate("/")}
        onShare={() => { }}
      />

      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--surface-primary)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--spacing-md)", padding: "var(--spacing-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", background: condColor, flexShrink: 0 }} />
              <span className="text-title-sm font-token-bold text-[var(--text-primary)] leading-none">
                {CONDITIONS[dayCond]?.label}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)", flexShrink: 0 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPageDay(addDays(pageDay, -1))}
              disabled={pageDay <= todayIso}
              className="h-[var(--touch-target)] w-[var(--touch-target)] border-[var(--border-primary)] bg-[var(--surface-primary)]"
              aria-label="Dia anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <DateFilterModal
              initialDate={pageDay}
              onApply={day => setPageDay(day)}
              trigger={
                <button
                  aria-label={`Data: ${parseDateLabel(pageDay)}. Clique para alterar`}
                  className="text-button font-token-bold flex items-center gap-[var(--spacing-sm)] px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-[var(--radius-minimal)] border-[1.5px] border-[var(--border-primary)] bg-[var(--surface-primary)] text-[var(--text-primary)] whitespace-nowrap h-[var(--touch-target)]"
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.8 }}>
                    <rect x="1.5" y="3.5" width="13" height="11" rx="2" stroke="var(--text-primary)" strokeWidth="1.5" />
                    <path d="M1.5 7h13" stroke="var(--text-primary)" strokeWidth="1.5" />
                    <path d="M5 1.5v3M11 1.5v3" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {shortDateLabel(pageDay)}
                </button>
              }
            />

            <Button
              variant="outline"
              size="icon"
              onClick={() => setPageDay(addDays(pageDay, 1))}
              disabled={pageDay >= maxIso}
              className="h-[var(--touch-target)] w-[var(--touch-target)] border-[var(--border-primary)] bg-[var(--surface-primary)]"
              aria-label="Próximo dia"
            >
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </Button>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {loading ? (
          <BeachDetailSkeleton />
        ) : error ? (
          <div role="alert" style={{ fontSize: "var(--font-size-body)", color: "var(--text-storm)", textAlign: "center", padding: "48px 0" }}>
            {error}
          </div>
        ) : beachData && hourData ? (

          <div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-md)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
                <span className="text-headline font-token-bold text-[var(--text-primary)]">
                  Condições às {fmtHr(scrubHour)}
                </span>
                <Badge variant={hourData.cond} size="small">
                  {CONDITIONS[hourData.cond]?.label}
                </Badge>
              </div>


            </div>

            <div className="flex gap-4 mb-4">
              <InfoBlock label="Altura maré" value={`${hourData.height}m`} />
              <InfoBlock label="Vento" value={`${hourData.windSpeed} km/h`} />
              <InfoBlock label="Período" value={`${hourData.swellPeriod}s`} />
            </div>

            <SwellPowerBar
              value={swellSegs(hourData.swellKj)}
              label={`${hourData.swellKj} Kj`}
              sublabel={SW_LABELS[swellSegs(hourData.swellKj) - 1]}
            />

            {tideError ? (
              <div style={{ display: "flex", alignItems: "center", borderRadius: "var(--radius-minimal)", background: "var(--surface-terciary)", marginBottom: "var(--spacing-xs)" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                  <circle cx="8" cy="8" r="7" stroke="var(--text-primary)" strokeWidth="1.5" />
                  <path d="M8 5v3.5" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="11.5" r="0.75" fill="var(--text-primary)" />
                </svg>
                <span style={{ fontSize: "var(--font-size-subtitle)", color: "var(--text-secondary)" }}>
                  Dados de maré temporariamente indisponíveis.
                </span>
              </div>
            ) : tideData ? (
              <div className="bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-[var(--radius-minimal)] p-[var(--spacing-md)] mt-4">
                <span className="text-subtitle font-token-regular text-[var(--text-secondary)] block mb-3">Maré</span>
                <TideChart tides={tideData?.tides} currentHour={scrubHour} />
                <div className="mt-1">
                  <TimeSlider value={scrubHour} onChange={setScrubHour} />
                </div>
              </div>
            ) : null}

          </div>
        ) : null}
      </div>
    </div>
  );
}
