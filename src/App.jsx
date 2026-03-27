import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams, useSearchParams } from "react-router-dom";

// ─── Dados ────────────────────────────────────────────────────────────────────

const BEACHES_META = {
  "Paiva":             { state: "PE", country: "Brasil", slug: "paiva" },
  "Itapuama":          { state: "PE", country: "Brasil", slug: "itapuama" },
  "Porto de Galinhas": { state: "PE", country: "Brasil", slug: "porto-de-galinhas" },
  "Maracaípe":         { state: "PE", country: "Brasil", slug: "maracaipe" },
  "Madeiro":           { state: "RN", country: "Brasil", slug: "madeiro" },
  "Baía Formosa":      { state: "RN", country: "Brasil", slug: "baia-formosa" },
  "Cacimba do Padre":  { state: "PE", country: "Brasil", slug: "cacimba-do-padre" },
  "Jericoacoara":      { state: "CE", country: "Brasil", slug: "jericoacoara" },
  "Tourinhos":         { state: "RN", country: "Brasil", slug: "tourinhos" },
};

const SLUG_TO_BEACH = Object.fromEntries(
  Object.entries(BEACHES_META).map(([name, meta]) => [meta.slug, name])
);

const BEACHES = Object.keys(BEACHES_META);
const API_BASE = "https://swellcheck.vercel.app";

const CONDITIONS = {
  flat:   { label: "Flat",   color: "#a07850" },
  marola: { label: "Marola", color: "#c8a800" },
  bom:    { label: "Bom",    color: "#2e9e6a" },
  storm:  { label: "Storm",  color: "#d04040" },
};

const COND_DESCS = { flat: "Não vale a pena", marola: "Vai depender", bom: "Vai surfar!", storm: "Cuidado" };
const COND_ORDER = { storm: 0, bom: 1, marola: 2, flat: 3 };

const PT_DAYS_FULL  = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const PT_DAYS_SHORT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const PT_MONTHS     = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const SW_COLORS     = ["#a07850","#c8a800","#2e9e6a","#e07820","#d04040"];
const SW_LABELS     = ["Fraco","Médio","Bom","Forte","Muito forte"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isoDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function getToday() {
  const t = new Date();
  return isoDate(t.getFullYear(), t.getMonth(), t.getDate());
}

function getMaxDay() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return isoDate(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(iso, n) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return isoDate(d.getFullYear(), d.getMonth(), d.getDate());
}

function isValidDate(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return iso >= getToday() && iso <= getMaxDay();
}

function parseDateLabel(iso) {
  const d = new Date(iso + "T12:00:00");
  const prefix = iso === getToday() ? "Hoje, " : `${PT_DAYS_FULL[d.getDay()]}, `;
  return `${prefix}${d.getDate()} de ${PT_MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

function shortDateLabel(iso) {
  if (iso === getToday()) return "Hoje";
  const d = new Date(iso + "T12:00:00");
  return `${PT_DAYS_SHORT[d.getDay()]}, ${d.getDate()} de ${PT_MONTHS[d.getMonth()]}`;
}

function fmtHr(hr) {
  if (hr === 0 || hr === 24) return "12am";
  if (hr === 12) return "12pm";
  return hr < 12 ? `${hr}am` : `${hr - 12}pm`;
}

function fmtTideHr(h) {
  const hr = Math.floor(h);
  const mn = Math.round((h - hr) * 60);
  const ampm = hr < 12 ? "am" : "pm";
  const disp = hr === 0 || hr === 24 ? 12 : hr > 12 ? hr - 12 : hr;
  return `${disp}:${mn < 10 ? "0" + mn : mn}${ampm}`;
}

function swellSegs(kj) {
  if (kj < 500)  return 1;
  if (kj < 1000) return 2;
  if (kj < 2000) return 3;
  if (kj < 3000) return 4;
  return 5;
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function fetchForecastAll(date) {
  const res = await fetch(`${API_BASE}/forecast-all?date=${date}`);
  if (!res.ok) throw new Error("Erro na API");
  return (await res.json()).beaches;
}

async function fetchForecast(beach, date) {
  const res = await fetch(`${API_BASE}/forecast?beach=${encodeURIComponent(beach)}&date=${date}`);
  if (!res.ok) throw new Error("Erro na API");
  return res.json();
}

async function fetchTide(date, beach) {
  const res = await fetch(`${API_BASE}/tide?date=${date}&beach=${encodeURIComponent(beach)}`);
  if (!res.ok) throw new Error("Erro na API de maré");
  return res.json();
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonPulse({ width = "100%", height = 14, borderRadius = 6, style = {} }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "skeletonPulse 1.4s ease-in-out infinite",
      flexShrink: 0,
      ...style,
    }} />
  );
}

function HomeCardSkeleton() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #e0e0e0", borderRadius: 16, padding: "18px 20px" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <SkeletonPulse width="55%" height={18} />
        <SkeletonPulse width="35%" height={12} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <SkeletonPulse width={40} height={10} />
        <SkeletonPulse width={40} height={20} />
      </div>
      <SkeletonPulse width={76} height={32} borderRadius={20} />
    </div>
  );
}

function BeachDetailSkeleton() {
  return (
    <div style={{ border: "1.5px solid #e0e0e0", borderRadius: 14, padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SkeletonPulse width={110} height={36} borderRadius={8} />
          <SkeletonPulse width={160} height={12} />
        </div>
        <SkeletonPulse width={80} height={12} />
      </div>
      <div style={{ height: 1, background: "#f0f0f0", margin: "20px 0" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <SkeletonPulse width={120} height={16} />
        <SkeletonPulse width={56} height={22} borderRadius={20} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ background: "#f7f7f7", borderRadius: 10, padding: "11px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            <SkeletonPulse width="50%" height={10} />
            <SkeletonPulse width="75%" height={14} />
          </div>
        ))}
      </div>
      <div style={{ background: "#f7f7f7", borderRadius: 10, padding: "11px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <SkeletonPulse width={80} height={10} />
          <SkeletonPulse width={60} height={12} />
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {[0,1,2,3,4].map(i => <SkeletonPulse key={i} height={6} borderRadius={4} style={{ flex: 1 }} />)}
        </div>
      </div>
      <div style={{ height: 1, background: "#f0f0f0", margin: "20px 0" }} />
      <SkeletonPulse width={40} height={10} style={{ marginBottom: 10 }} />
      <SkeletonPulse width="100%" height={90} borderRadius={8} style={{ marginBottom: 8 }} />
      <SkeletonPulse width="100%" height={44} borderRadius={8} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {[0,1,2,3,4].map(i => <SkeletonPulse key={i} width={28} height={10} />)}
      </div>
    </div>
  );
}

// ─── BackButton ───────────────────────────────────────────────────────────────

function BackButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label="Voltar para lista de praias"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#111", fontSize: 13, fontWeight: 500, padding: "4px 0", marginLeft: -2, textDecoration: hovered ? "underline" : "none", textUnderlineOffset: 3 }}
    >
      <span style={{ fontSize: 24, lineHeight: 1, marginTop: -1 }}>‹</span>
      Voltar
    </button>
  );
}

// ─── NavButton ────────────────────────────────────────────────────────────────

function NavButton({ onClick, disabled, children, ariaLabel }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        border: disabled ? "1.5px solid #e8e8e8" : hovered ? "1.5px solid #111" : "1.5px solid #d0d0d0",
        background: disabled ? "#fafafa" : hovered ? "#f7f7f7" : "#fff",
        color: disabled ? "#ccc" : "#111",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
        transition: "border 0.12s, background 0.12s",
      }}
    >{children}</button>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function Calendar({ selected, onSelect }) {
  const todayIso = getToday();
  const maxIso = getMaxDay();
  const initDate = new Date(selected + "T12:00:00");
  const [view, setView] = useState({ y: initDate.getFullYear(), m: initDate.getMonth() });
  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <NavButton ariaLabel="Mês anterior" onClick={() => setView(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 })} disabled={false}>‹</NavButton>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{PT_MONTHS[view.m]} {view.y}</span>
        <NavButton ariaLabel="Próximo mês" onClick={() => setView(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 })} disabled={false}>›</NavButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 4, marginBottom: 6 }}>
        {PT_DAYS_SHORT.map(dl => <div key={dl} style={{ textAlign: "center", fontSize: 11, color: "#999", fontWeight: 500 }}>{dl}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 4 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const iso = isoDate(view.y, view.m, day);
          const isSelected = selected === iso;
          const isToday = iso === todayIso;
          const disabled = iso < todayIso || iso > maxIso;
          return (
            <button key={iso} onClick={() => !disabled && onSelect(iso)}
              aria-label={`${day} de ${PT_MONTHS[view.m]}`}
              aria-pressed={isSelected}
              style={{
                aspectRatio: "1/1", width: "100%", borderRadius: 8, boxSizing: "border-box",
                border: isSelected ? "2px solid #111" : "2px solid transparent",
                background: isSelected ? "#111" : "transparent",
                color: disabled ? "#ccc" : isSelected ? "#fff" : "#111",
                fontWeight: isToday ? 700 : 400,
                fontSize: 13, cursor: disabled ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{day}</button>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: "#bbb", marginTop: 14, textAlign: "center" }}>
        Previsão disponível para os próximos 14 dias
      </div>
    </div>
  );
}

// ─── CalendarModal ────────────────────────────────────────────────────────────

function CalendarModal({ selected, onApply, onClose }) {
  const todayIso = getToday();
  const [tempDay, setTempDay] = useState(selected);
  return (
    <div
      role="dialog" aria-modal="true" aria-label="Filtrar por data"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 16, padding: "24px 20px", width: "100%", maxWidth: 360, margin: "0 16px", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>Filtrar por data</span>
          <button onClick={onClose} aria-label="Fechar calendário"
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#999", borderRadius: 6 }}>×</button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setTempDay(todayIso)}
            style={{ padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, border: "2px solid #111", background: tempDay === todayIso ? "#111" : "#fff", color: tempDay === todayIso ? "#fff" : "#111" }}>
            Hoje
          </button>
        </div>
        <Calendar selected={tempDay} onSelect={setTempDay} />
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, border: "2px solid #e0e0e0", background: "#fff", color: "#111" }}>
            Cancelar
          </button>
          <button onClick={() => onApply(tempDay)}
            style={{ flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, border: "2px solid #111", background: "#111", color: "#fff" }}>
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TideChart ────────────────────────────────────────────────────────────────

function TideChart({ tides, currentHour }) {
  const containerRef = useRef(null);
  const [svgWidth, setSvgWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    setSvgWidth(containerRef.current.getBoundingClientRect().width);
    const ro = new ResizeObserver(entries => setSvgWidth(Math.round(entries[0].contentRect.width)));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  if (!tides || tides.length === 0) return null;
  if (svgWidth === 0) return <div ref={containerRef} style={{ width: "100%", height: 90 }} />;

  const W = svgWidth, H = 90, PAD_X = 8, PAD_Y = 14;
  const tidePts = tides.map(t => {
    const [hr, mn] = t.hour.split(":").map(Number);
    return { hour: hr + mn / 60, level: t.level, high: t.level > 1.2 };
  });

  const steps = 120;
  const curve = [];
  for (let i = 0; i <= steps; i++) {
    const h = (i / steps) * 24;
    let num = 0, den = 0;
    for (const p of tidePts) {
      const w = Math.exp(-Math.pow(h - p.hour, 2) / 7);
      num += p.level * w; den += w;
    }
    curve.push({ h, level: num / den });
  }

  const xOf = h => PAD_X + (h / 24) * (W - PAD_X * 2);
  const yOf = l => H - PAD_Y - (l / 2.6) * (H - PAD_Y * 2);
  const linePath = curve.map((pt, i) => `${i === 0 ? "M" : "L"}${xOf(pt.h).toFixed(1)},${yOf(pt.level).toFixed(1)}`).join(" ");
  const fillPath = `${linePath} L${xOf(24)},${H} L${xOf(0)},${H} Z`;
  const cx = xOf(Math.min(Math.max(currentHour, 0), 24));

  return (
    <div ref={containerRef} style={{ width: "100%" }} role="img" aria-label="Gráfico de maré">
      <svg width={W} height={H} style={{ display: "block", overflow: "visible" }}>
        <path d={fillPath} fill="rgba(0,0,0,0.05)" stroke="none" />
        <path d={linePath} fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {tidePts.map((p, i) => {
          const pcx = xOf(p.hour), pcy = yOf(p.level);
          return (
            <g key={i}>
              <circle cx={pcx} cy={pcy} r="3" fill="#bbb" />
              <text x={pcx} y={p.high ? pcy - 10 : pcy + 14}
                textAnchor="middle" fontSize="11" fill="#888" fontFamily="Inter,sans-serif" fontWeight="500">
                {fmtTideHr(p.hour)}
              </text>
            </g>
          );
        })}
        <line x1={cx} y1={0} x2={cx} y2={H} stroke="#111" strokeWidth="1.5" strokeDasharray="3,3" />
      </svg>
    </div>
  );
}

// ─── Scrubber ─────────────────────────────────────────────────────────────────

function Scrubber({ value, onChange }) {
  const trackRef = useRef(null);

  function getHourFromEvent(clientX) {
    const rect = trackRef.current.getBoundingClientRect();
    return Math.round(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 24);
  }

  function handleMouseDown(e) {
    onChange(getHourFromEvent(e.clientX));
    const onMove = e2 => onChange(getHourFromEvent(e2.clientX));
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function handleTouchStart(e) {
    e.preventDefault();
    onChange(getHourFromEvent(e.touches[0].clientX));
    const onMove = e2 => { e2.preventDefault(); onChange(getHourFromEvent(e2.touches[0].clientX)); };
    const onEnd = () => { window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
  }

  const pct = (value / 24) * 100;

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label="Hora do dia"
      aria-valuemin={0} aria-valuemax={24} aria-valuenow={value} aria-valuetext={fmtHr(value)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ position: "relative", height: 44, display: "flex", alignItems: "center", cursor: "pointer", marginTop: 8, userSelect: "none" }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, height: 3, background: "#e0e0e0", borderRadius: 99 }} />
      <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: 3, background: "#111", borderRadius: 99 }} />
      <div style={{ position: "absolute", left: `${pct}%`, transform: "translateX(-50%)", width: 18, height: 18, borderRadius: "50%", background: "#111", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </div>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────

function HomeScreen() {
  const navigate = useNavigate();
  const currentHour = new Date().getHours();
  const todayIso = getToday();

  const [query, setQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState(todayIso);
  const [goodBeaches, setGoodBeaches] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [showCal, setShowCal] = useState(false);

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
    ? goodBeaches.filter(b => b.beach.toLowerCase().includes(query.toLowerCase()))
    : goodBeaches;

  const goToBeach = (beachName) => {
    const slug = BEACHES_META[beachName]?.slug;
    if (!slug) return;
    const params = selectedDay !== todayIso ? `?data=${selectedDay}` : "";
    navigate(`/praia/${slug}${params}`);
  };

  return (
    <div style={{ width: "100%", maxWidth: 680, margin: "0 auto", padding: "40px 16px 80px" }}>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 11, color: "#999", fontWeight: 500, marginBottom: 8 }}>Swell check</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#111" }}>Previsão para Surf</div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              placeholder="Buscar praia..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Buscar praia"
              style={{ width: "100%", padding: "13px 40px 13px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 14, color: "#111", outline: "none", boxSizing: "border-box", background: "#fff" }}
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Limpar busca"
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 18, lineHeight: 1, padding: 4 }}>×</button>
            )}
          </div>
          <button onClick={() => setShowCal(true)} aria-label="Filtrar por data"
            style={{ flexShrink: 0, padding: "0 16px", borderRadius: 10, border: "1.5px solid #111", background: "#111", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            Filtrar por data
          </button>
        </div>
        <div style={{ fontSize: 13, color: "#999" }}>
          Exibindo resultados para:{" "}
          <span style={{ color: "#111", fontWeight: 600 }}>{parseDateLabel(selectedDay)}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {listLoading
          ? BEACHES.map((_, i) => <HomeCardSkeleton key={i} />)
          : filtered.length === 0
            ? <div style={{ fontSize: 14, color: "#bbb", padding: "24px 0" }}>Nenhuma praia encontrada.</div>
            : filtered.map(b => {
                const c = CONDITIONS[b.cond];
                const meta = BEACHES_META[b.beach];
                const h = b.hours?.[currentHour];
                return (
                  <button key={b.beach} onClick={() => goToBeach(b.beach)}
                    aria-label={`Ver previsão de ${b.beach}, condição: ${c.label}`}
                    style={{ display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #e0e0e0", borderRadius: 16, padding: "18px 20px", cursor: "pointer", background: "#fff", textAlign: "left", width: "100%", transition: "background 0.1s, border-color 0.1s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f7f7f7"; e.currentTarget.style.borderColor = "#ccc"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e0e0e0"; }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.beach}</div>
                      <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>{meta?.state}, {meta?.country}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0 }}>
                      <div style={{ fontSize: 10, color: "#bbb", fontWeight: 500 }}>Altura</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>{h?.height ?? "—"}m</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 20, flexShrink: 0, background: c.color + "18" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: c.color }}>{c.label}</span>
                    </div>
                  </button>
                );
              })
        }
      </div>

      <div style={{ marginTop: 48 }}>
        <div style={{ height: 1, background: "#f0f0f0", marginBottom: 16 }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(CONDITIONS).map(([key, c]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#999" }}>{c.label} — {COND_DESCS[key]}</span>
            </div>
          ))}
        </div>
      </div>

      {showCal && (
        <CalendarModal
          selected={selectedDay}
          onApply={day => { setSelectedDay(day); setShowCal(false); }}
          onClose={() => setShowCal(false)}
        />
      )}
    </div>
  );
}

// ─── BeachPage ────────────────────────────────────────────────────────────────

function BeachPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const beach = SLUG_TO_BEACH[slug];
  const todayIso = getToday();
  const maxIso = getMaxDay();
  const currentHour = new Date().getHours();
  const meta = BEACHES_META[beach];

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
  const [tideError, setTideError] = useState(false);   // ← novo: erro isolado de maré
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrubHour, setScrubHour] = useState(currentHour);
  const [showCal, setShowCal] = useState(false);

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

    // Forecast e tide em paralelo, mas independentes
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
      .catch(() => setTideError(true));   // ← maré falhou, mas não afeta o resto

  }, [beach, pageDay, currentHour]);

  if (!beach) return null;

  const safeHour = Math.min(scrubHour, 23);
  const hourData = beachData?.hours?.[safeHour];
  const dayCond = beachData?.cond;
  const condColor = dayCond ? CONDITIONS[dayCond]?.color : "#999";
  const bestStart = beachData?.bestStart;
  const bestEnd = beachData?.bestEnd;

  return (
    <div style={{ width: "100%", maxWidth: 680, margin: "0 auto", padding: "0 0 80px" }}>

      {/* Header sticky — 2 linhas */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#fff", borderBottom: "1px solid #f0f0f0" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 8px", borderBottom: "1px solid #f0f0f0" }}>
          <BackButton onClick={() => navigate("/")} />
          <div style={{ fontSize: 11, color: "#999", fontWeight: 500 }}>Swell check</div>
          <div style={{ width: 60 }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 16px 12px" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {beach}{meta ? `, ${meta.state}` : ""}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <NavButton ariaLabel="Dia anterior" onClick={() => setPageDay(addDays(pageDay, -1))} disabled={pageDay <= todayIso}>‹</NavButton>
            <button onClick={() => setShowCal(true)}
              aria-label={`Data: ${parseDateLabel(pageDay)}. Clique para alterar`}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e0e0e0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#111", whiteSpace: "nowrap" }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                <rect x="1" y="3" width="14" height="12" rx="2" stroke="#111" strokeWidth="1.5" />
                <path d="M1 7h14" stroke="#111" strokeWidth="1.5" />
                <path d="M5 1v3M11 1v3" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {shortDateLabel(pageDay)}
            </button>
            <NavButton ariaLabel="Próximo dia" onClick={() => setPageDay(addDays(pageDay, 1))} disabled={pageDay >= maxIso}>›</NavButton>
          </div>
        </div>

      </div>

      {/* Conteúdo */}
      <div style={{ padding: "20px 16px 0" }}>
        {loading ? (
          <BeachDetailSkeleton />
        ) : error ? (
          <div role="alert" style={{ fontSize: 14, color: "#d04040", textAlign: "center", padding: "48px 0" }}>{error}</div>
        ) : beachData && hourData ? (
          <div style={{ border: "1.5px solid #e0e0e0", borderRadius: 14, padding: "24px 20px" }}>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: condColor, flexShrink: 0 }} />
                  <span style={{ fontSize: 32, fontWeight: 700, color: "#111", lineHeight: 1 }}>{CONDITIONS[dayCond]?.label}</span>
                </div>
                <div style={{ fontSize: 13, color: "#999" }}>{parseDateLabel(pageDay)}</div>
              </div>
              {bestStart != null && bestEnd != null && (
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: "#bbb", marginBottom: 3 }}>Melhor horário</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{fmtHr(bestStart)} – {fmtHr(bestEnd)}</div>
                </div>
              )}
            </div>

            <div style={{ height: 1, background: "#f0f0f0", margin: "20px 0" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>Condições às {fmtHr(scrubHour)}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: CONDITIONS[hourData.cond]?.color + "18", color: CONDITIONS[hourData.cond]?.color }}>
                {CONDITIONS[hourData.cond]?.label}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              {[
                { label: "Altura total",     value: `${hourData.height}m` },
                { label: "Vento",            value: `${hourData.windSpeed} km/h ${hourData.windDir} (${hourData.windType === "offshore" ? "terral" : hourData.windType === "onshore" ? "maral" : "lateral"})` },
                { label: "Swell",            value: `${hourData.swellHeight}m · ${hourData.swellDir}` },
                { label: "Período do swell", value: `${hourData.swellPeriod}s` },
              ].map(item => (
                <div key={item.label} style={{ background: "#f7f7f7", borderRadius: 10, padding: "11px 12px" }}>
                  <div style={{ fontSize: 10, color: "#999", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#f7f7f7", borderRadius: 10, padding: "11px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: "#999" }}>Força do swell</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>
                  {hourData.swellKj} Kj{" "}
                  <span style={{ fontSize: 11, color: "#999", fontWeight: 400 }}>· {SW_LABELS[swellSegs(hourData.swellKj) - 1]}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                {[0,1,2,3,4].map(i => {
                  const active = swellSegs(hourData.swellKj);
                  return <div key={i} style={{ flex: 1, height: 6, borderRadius: 4, background: i < active ? SW_COLORS[active - 1] : "#e0e0e0" }} />;
                })}
              </div>
            </div>

            {/* ─── Seção de maré — renderiza apenas se tiver dados ─── */}
            <div style={{ height: 1, background: "#f0f0f0", margin: "20px 0" }} />

            <div style={{ fontSize: 11, color: "#999", marginBottom: 10 }}>Maré</div>

            {tideError ? (
              /* Mensagem discreta quando a API de maré está fora */
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 14px", borderRadius: 10,
                background: "#f7f7f7", marginBottom: 4,
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                  <circle cx="8" cy="8" r="7" stroke="#111" strokeWidth="1.5" />
                  <path d="M8 5v3.5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="11.5" r="0.75" fill="#111" />
                </svg>
                <span style={{ fontSize: 12, color: "#999" }}>Dados de maré temporariamente indisponíveis.</span>
              </div>
            ) : tideData ? (
              /* Gráfico + scrubber normais */
              <>
                <TideChart tides={tideData?.tides} currentHour={scrubHour} />
                <Scrubber value={scrubHour} onChange={setScrubHour} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#ccc", padding: "4px 2px 0" }}>
                  <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>12am</span>
                </div>
              </>
            ) : null /* ainda carregando maré — não mostra nada */ }

          </div>
        ) : null}
      </div>

      {showCal && (
        <CalendarModal
          selected={pageDay}
          onApply={day => { setPageDay(day); setShowCal(false); }}
          onClose={() => setShowCal(false)}
        />
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "#fff";
    document.documentElement.style.background = "#fff";
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #fff; min-height: 100vh; overflow-x: hidden; }
        body { font-family: 'Inter', sans-serif; }
        button { font-family: inherit; }
        @keyframes skeletonPulse {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <BrowserRouter>
        <main style={{ minHeight: "100vh", background: "#fff" }}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/praia/:slug" element={<BeachPage />} />
            <Route path="*" element={<HomeScreen />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}
