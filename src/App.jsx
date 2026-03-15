import { useState, useEffect, useRef } from "react";

const BEACHES = ["Paiva", "Itapuama", "Porto de Galinhas", "Maracaípe", "Madeiro", "Baía Formosa", "Cacimba do Padre", "Jericoacoara", "Tourinhos"];
const API_BASE = "https://swellcheck.vercel.app";

const CONDITIONS = {
  flat:   { label: "Flat",   color: "#a07850" },
  marola: { label: "Marola", color: "#c8a800" },
  bom:    { label: "Bom",    color: "#2e9e6a" },
  storm:  { label: "Storm",  color: "#d04040" },
};

const COND_DESCS = { flat:"Não vale a pena", marola:"Vai depender", bom:"Vai surfar!", storm:"Cuidado" };

const PT_DAYS_FULL  = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const PT_MONTHS     = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const PT_DAYS_SHORT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const SW_COLORS     = ["#a07850","#c8a800","#2e9e6a","#e07820","#d04040"];
const SW_LABELS     = ["Fraco","Médio","Bom","Forte","Muito forte"];

function isoDate(y, m, d) {
  return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

function parseDateLabel(iso) {
  const dateObj = new Date(iso + "T12:00:00");
  const today = new Date();
  const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate());
  const prefix = iso === todayIso ? "Hoje, " : `${PT_DAYS_FULL[dateObj.getDay()]}, `;
  return `${prefix}${dateObj.getDate()} de ${PT_MONTHS[dateObj.getMonth()]} de ${dateObj.getFullYear()}`;
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
  return `${disp}:${mn < 10 ? "0"+mn : mn}${ampm}`;
}

function swellSegs(kj) {
  if (kj < 500)  return 1;
  if (kj < 1000) return 2;
  if (kj < 2000) return 3;
  if (kj < 3000) return 4;
  return 5;
}

function NavButton({ onClick, disabled, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={() => !disabled && onClick()} disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:36, height:36, borderRadius:8, flexShrink:0,
        border: disabled ? "1.5px solid #e8e8e8" : hovered ? "1.5px solid #111" : "1.5px solid #d0d0d0",
        background: disabled ? "#fafafa" : hovered ? "#f7f7f7" : "#fff",
        color: disabled ? "#ccc" : "#111",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize:20, display:"flex", alignItems:"center", justifyContent:"center",
        transition:"border 0.12s, background 0.12s",
      }}>{children}</button>
  );
}

function Calendar({ selected, onSelect }) {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate());
  const maxDate = new Date(); maxDate.setDate(maxDate.getDate() + 14);
  const maxIso = isoDate(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <NavButton onClick={() => setView(v => v.m===0?{y:v.y-1,m:11}:{y:v.y,m:v.m-1})} disabled={false}>‹</NavButton>
        <span style={{ fontSize:14, fontWeight:600, color:"#111" }}>{PT_MONTHS[view.m]} {view.y}</span>
        <NavButton onClick={() => setView(v => v.m===11?{y:v.y+1,m:0}:{y:v.y,m:v.m+1})} disabled={false}>›</NavButton>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7, minmax(0, 1fr))", gap:4, marginBottom:6 }}>
        {PT_DAYS_SHORT.map(dl => <div key={dl} style={{ textAlign:"center", fontSize:11, color:"#999", fontWeight:500 }}>{dl}</div>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7, minmax(0, 1fr))", gap:4 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const iso = isoDate(view.y, view.m, day);
          const isSelected = selected === iso;
          const isToday = iso === todayIso;
          const disabled = iso < todayIso || iso > maxIso;
          return (
            <button key={iso} onClick={() => !disabled && onSelect(iso)} style={{
              aspectRatio:"1/1", width:"100%", borderRadius:8, boxSizing:"border-box",
              border: isSelected ? "2px solid #111" : "2px solid transparent",
              background: isSelected ? "#111" : "transparent",
              color: disabled ? "#ccc" : isSelected ? "#fff" : "#111",
              fontWeight: isToday ? 700 : 400,
              fontSize:13, cursor: disabled ? "default" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>{day}</button>
          );
        })}
      </div>
      <div style={{ fontSize:11, color:"#bbb", marginTop:14, textAlign:"center" }}>
        Previsão disponível para os próximos 14 dias
      </div>
    </div>
  );
}

function TideChart({ tides, currentHour }) {
  const containerRef = useRef(null);
  const [svgWidth, setSvgWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    setSvgWidth(containerRef.current.getBoundingClientRect().width);
    const ro = new ResizeObserver(entries => {
      setSvgWidth(Math.round(entries[0].contentRect.width));
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  if (!tides || tides.length === 0) return null;
  if (svgWidth === 0) return <div ref={containerRef} style={{ width:"100%", height:90 }} />;

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
  const safeHour = Math.min(Math.max(currentHour, 0), 24);
  const cx = xOf(safeHour);

  return (
    <div ref={containerRef} style={{ width:"100%" }}>
      <svg width={W} height={H} style={{ display:"block", overflow:"visible" }}>
        <path d={fillPath} fill="rgba(0,0,0,0.05)" stroke="none" />
        <path d={linePath} fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {tidePts.map((p, i) => {
          const pcx = xOf(p.hour), pcy = yOf(p.level);
          return (
            <g key={i}>
              <circle cx={pcx} cy={pcy} r="3" fill="#bbb" />
              <text x={pcx} y={p.high ? pcy - 10 : pcy + 14}
                textAnchor="middle" fontSize="11" fill="#888"
                fontFamily="Inter,sans-serif" fontWeight="500">
                {fmtTideHr(p.hour)}
              </text>
            </g>
          );
        })}
        <line x1={cx} y1={0} x2={cx} y2={H} stroke="#bbb" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function Scrubber({ value, onChange }) {
  const trackRef = useRef(null);

  function getHourFromEvent(clientX) {
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(pct * 24);
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
    <div ref={trackRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ position:"relative", height:44, display:"flex", alignItems:"center", cursor:"pointer", marginTop:8, userSelect:"none" }}>
      <div style={{ position:"absolute", left:0, right:0, height:3, background:"#e0e0e0", borderRadius:99 }} />
      <div style={{ position:"absolute", left:0, width:`${pct}%`, height:3, background:"#111", borderRadius:99 }} />
      <div style={{ position:"absolute", left:`${pct}%`, transform:"translateX(-50%)", width:18, height:18, borderRadius:"50%", background:"#111", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }} />
    </div>
  );
}

function BeachSearch({ onSelect, selectedBeach }) {
  const [query, setQuery] = useState(selectedBeach || "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => { setQuery(selectedBeach || ""); }, [selectedBeach]);
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false); setQuery(selectedBeach || "");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedBeach]);
  const filtered = BEACHES.filter(b => {
    if (!query || query === selectedBeach) return true;
    return b.toLowerCase().includes(query.toLowerCase());
  });
  const handleFocus = () => { setQuery(""); setOpen(true); };
  const handleChange = (e) => { setQuery(e.target.value); setOpen(true); };
  const handlePick = (b) => { onSelect(b); setQuery(b); setOpen(false); };
  const handleClear = () => { onSelect(null); setQuery(""); setOpen(false); };
  return (
    <div ref={containerRef} style={{ flex:1, position:"relative" }}>
      <input type="text" placeholder="Buscar praia..." value={query}
        onChange={handleChange} onFocus={handleFocus}
        style={{ width:"100%", padding:"13px 40px 13px 16px", borderRadius:10, border:"2px solid #e0e0e0", fontSize:14, color:"#111", outline:"none", boxSizing:"border-box", background:"#fff" }}
      />
      {selectedBeach && (
        <button onMouseDown={handleClear} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#bbb", fontSize:18, lineHeight:1, padding:2 }}>×</button>
      )}
      {open && filtered.length > 0 && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:20, background:"#fff", border:"1.5px solid #e0e0e0", borderRadius:10, overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,0.08)" }}>
          {filtered.map(b => {
            const isActive = b === selectedBeach;
            return (
              <div key={b} onMouseDown={() => handlePick(b)} style={{ padding:"12px 16px", fontSize:14, color:"#111", cursor:"pointer", borderBottom:"1px solid #f0f0f0", background: isActive ? "#f7f7f7" : "#fff", display:"flex", alignItems:"center", justifyContent:"space-between" }}
                onMouseEnter={e => e.currentTarget.style.background="#f0f0f0"}
                onMouseLeave={e => e.currentTarget.style.background = isActive ? "#f7f7f7" : "#fff"}
              >
                {b}
                {isActive && <span style={{ fontSize:14, color:"#111" }}>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

async function fetchForecast(beach, date) {
  const res = await fetch(`${API_BASE}/forecast?beach=${encodeURIComponent(beach)}&date=${date}`);
  if (!res.ok) throw new Error("Erro na API");
  return res.json();
}

async function fetchTide(date, beach) {
  const res = await fetch(`${API_BASE}/tide?date=${date}&beach=${encodeURIComponent(beach)}`);
  if (!res.ok) throw new Error("Erro na API");
  return res.json();
}

export default function App() {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "#fff";
    document.documentElement.style.background = "#fff";
  }, []);

  const today = new Date();
  const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate());
  const currentHour = today.getHours();

  const [beach, setBeach] = useState(null);
  const [selectedDay, setSelectedDay] = useState(todayIso);
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempDay, setTempDay] = useState(todayIso);
  const [beachData, setBeachData] = useState(null);
  const [tideData, setTideData] = useState(null);
  const [beachLoading, setBeachLoading] = useState(false);
  const [beachError, setBeachError] = useState(null);
  const [scrubHour, setScrubHour] = useState(currentHour);
  const [goodBeaches, setGoodBeaches] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const COND_ORDER = { storm: 0, bom: 1, marola: 2, flat: 3 };

  const selectBeach = (b) => { setBeach(b); setBeachData(null); setTideData(null); if (!b) setGoodBeaches([]); };
  const openCalendar = () => { setTempDay(selectedDay); setShowCalendar(true); };
  const handleApply = () => { setSelectedDay(tempDay); setShowCalendar(false); };
  const handleCancel = () => setShowCalendar(false);

  useEffect(() => {
    if (!beach) return;
    setBeachLoading(true); setBeachError(null); setBeachData(null); setTideData(null);
    Promise.all([fetchForecast(beach, selectedDay), fetchTide(selectedDay, beach)])
      .then(([forecast, tide]) => {
        setBeachData(forecast); setTideData(tide); setBeachLoading(false);
        setScrubHour(currentHour);
      })
      .catch(() => { setBeachError("Não foi possível carregar os dados."); setBeachLoading(false); });
  }, [beach, selectedDay]);

  useEffect(() => {
    if (beach) return;
    setListLoading(true);
    Promise.all(BEACHES.map(b => fetchForecast(b, selectedDay).catch(() => null)))
      .then(results => {
        const all = results
          .map((d, i) => d ? { ...d, beach: BEACHES[i] } : null)
          .filter(Boolean)
          .sort((a, b) => (COND_ORDER[a.cond] ?? 99) - (COND_ORDER[b.cond] ?? 99));
        setGoodBeaches(all); setListLoading(false);
      });
  }, [beach, selectedDay]);

  const safeHour = Math.min(scrubHour, 23);
  const hourData = beachData?.hours?.[safeHour];
  const dayCond = beachData?.cond;
  const dayCondColor = dayCond ? CONDITIONS[dayCond]?.color : "#999";
  const bestStart = beachData?.bestStart;
  const bestEnd = beachData?.bestEnd;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #fff; min-height: 100vh; overflow-x: hidden; }
      `}</style>
      <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"'Inter', sans-serif", padding:"40px 16px 80px" }}>
        <div style={{ width:"100%", maxWidth:680, margin:"0 auto", display:"flex", flexDirection:"column" }}>

          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:11, color:"#999", fontWeight:500, marginBottom:8 }}>Swell check</div>
            <div style={{ fontSize:26, fontWeight:700, color:"#111" }}>Previsão para Surf</div>
          </div>

          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:13, color:"#999", fontWeight:500, marginBottom:10 }}>Praia</div>
            <div style={{ display:"flex", gap:8 }}>
              <BeachSearch onSelect={selectBeach} selectedBeach={beach} />
              <button onClick={openCalendar} style={{ flexShrink:0, padding:"0 16px", borderRadius:10, border:"2px solid #111", background:"#111", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>Filtrar por data</button>
            </div>
            <div style={{ fontSize:13, color:"#999", marginTop:10 }}>
              Exibindo resultados para: <span style={{ color:"#111", fontWeight:600 }}>{parseDateLabel(selectedDay)}</span>
            </div>
          </div>

          <div style={{ marginTop:24 }}>
            {beach ? (
              beachLoading ? (
                <div style={{ fontSize:14, color:"#bbb", textAlign:"center", padding:"32px 0" }}>Carregando...</div>
              ) : beachError ? (
                <div style={{ fontSize:14, color:"#d04040", textAlign:"center", padding:"32px 0" }}>{beachError}</div>
              ) : beachData && hourData ? (
                <div style={{ border:"1.5px solid #e0e0e0", borderRadius:14, padding:"24px 20px" }}>

                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ width:14, height:14, borderRadius:"50%", background:dayCondColor, flexShrink:0, display:"inline-block" }} />
                      <span style={{ fontSize:32, fontWeight:700, color:"#111", lineHeight:1 }}>{CONDITIONS[dayCond]?.label}</span>
                    </div>
                    {bestStart != null && bestEnd != null && (
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:10, color:"#999", marginBottom:2 }}>Melhor horário</div>
                        <div style={{ fontSize:13, fontWeight:600, color:"#111" }}>{fmtHr(bestStart)} – {fmtHr(bestEnd)}</div>
                      </div>
                    )}
                  </div>
                  <div style={{ height:1, background:"#f0f0f0", margin:"20px 0" }} />

                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                    <span style={{ fontSize:15, fontWeight:700, color:"#111" }}>Condições às {fmtHr(scrubHour)}</span>
                    <span style={{ fontSize:11, fontWeight:600, padding:"3px 8px", borderRadius:20, background: CONDITIONS[hourData.cond]?.color + "18", color: CONDITIONS[hourData.cond]?.color }}>
                      {CONDITIONS[hourData.cond]?.label}
                    </span>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                    {[
                      { label:"Altura total",     value:`${hourData.height}m` },
                      { label:"Vento",            value:`${hourData.windSpeed} km/h ${hourData.windDir} (${hourData.windType === "offshore" ? "terral" : hourData.windType === "onshore" ? "maral" : "lateral"})` },
                      { label:"Swell",            value:`${hourData.swellHeight}m · ${hourData.swellDir}` },
                      { label:"Período do swell", value:`${hourData.swellPeriod}s` },
                    ].map(item => (
                      <div key={item.label} style={{ background:"#f7f7f7", borderRadius:10, padding:"11px 12px" }}>
                        <div style={{ fontSize:10, color:"#999", marginBottom:4 }}>{item.label}</div>
                        <div style={{ fontSize:14, fontWeight:600, color:"#111" }}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background:"#f7f7f7", borderRadius:10, padding:"11px 12px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ fontSize:10, color:"#999" }}>Força do swell</div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#111" }}>
                        {hourData.swellKj} Kj <span style={{ fontSize:11, color:"#999", fontWeight:400 }}>· {SW_LABELS[swellSegs(hourData.swellKj) - 1]}</span>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:3 }}>
                      {[0,1,2,3,4].map(i => {
                        const active = swellSegs(hourData.swellKj);
                        return <div key={i} style={{ flex:1, height:6, borderRadius:4, background: i < active ? SW_COLORS[active-1] : "#e0e0e0" }} />;
                      })}
                    </div>
                  </div>

                  <div style={{ height:1, background:"#f0f0f0", margin:"20px 0" }} />

                  <div style={{ fontSize:11, color:"#999", marginBottom:10 }}>Maré</div>
                  <TideChart tides={tideData?.tides} currentHour={scrubHour} />
                  <Scrubber value={scrubHour} onChange={setScrubHour} />
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#ccc", padding:"4px 2px 0" }}>
                    <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>12am</span>
                  </div>

                </div>
              ) : null
            ) : (
              <div>
                <div style={{ fontSize:13, color:"#999", fontWeight:500, marginBottom:12 }}>
                  Condições para {parseDateLabel(selectedDay).toLowerCase()}
                </div>
                {listLoading ? (
                  <div style={{ fontSize:14, color:"#bbb", textAlign:"center", padding:"32px 0" }}>Carregando...</div>
                ) : goodBeaches.length === 0 ? (
                  <div style={{ fontSize:14, color:"#bbb" }}>Nenhuma praia disponível para o dia selecionado.</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {goodBeaches.map(beach2 => {
                      const c = CONDITIONS[beach2.cond];
                      return (
                        <div key={beach2.beach} onClick={() => selectBeach(beach2.beach)} style={{ border:"1.5px solid #e0e0e0", borderRadius:12, padding:"14px 16px", cursor:"pointer", display:"grid", alignItems:"center", gridTemplateColumns:"72px 1fr auto auto", gap:12, background:"#fff" }}
                          onMouseEnter={e => e.currentTarget.style.background="#f7f7f7"}
                          onMouseLeave={e => e.currentTarget.style.background="#fff"}
                        >
                          <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600, color:c.color, background: c.color + "18", borderRadius:20, padding:"4px 10px" }}>
                            <span style={{ width:7, height:7, borderRadius:"50%", background:c.color, flexShrink:0 }} />
                            {c.label}
                          </span>
                          <span style={{ fontSize:15, fontWeight:600, color:"#111" }}>{beach2.beach}</span>
                          <span style={{ fontSize:13, color:"#bbb", textAlign:"right" }}>{beach2.hours?.[currentHour]?.height ?? "—"}m</span>
                          <span style={{ fontSize:13, color:"#bbb", textAlign:"right" }}>{beach2.hours?.[currentHour]?.windSpeed ?? "—"} km/h {beach2.hours?.[currentHour]?.windDir ?? ""}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {showCalendar && (
            <div onClick={handleCancel} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:16, padding:"24px 20px", width:"100%", maxWidth:360, margin:"0 16px", boxShadow:"0 8px 32px rgba(0,0,0,0.16)" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                  <span style={{ fontSize:14, fontWeight:600, color:"#111" }}>Filtrar por data</span>
                  <button onClick={handleCancel} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#999", lineHeight:1 }}>×</button>
                </div>
                <div style={{ marginBottom:16 }}>
                  <button onClick={() => setTempDay(todayIso)} style={{ padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, border:"2px solid #111", background: tempDay === todayIso ? "#111" : "#fff", color: tempDay === todayIso ? "#fff" : "#111" }}>Hoje</button>
                </div>
                <Calendar selected={tempDay} onSelect={setTempDay} />
                <div style={{ display:"flex", gap:8, marginTop:20 }}>
                  <button onClick={handleCancel} style={{ flex:1, padding:"12px", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:600, border:"2px solid #e0e0e0", background:"#fff", color:"#111" }}>Cancelar</button>
                  <button onClick={handleApply} style={{ flex:1, padding:"12px", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:600, border:"2px solid #111", background:"#111", color:"#fff" }}>Aplicar</button>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop:"auto", paddingTop:48 }}>
            <div style={{ height:1, background:"#f0f0f0", marginBottom:16 }} />
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {Object.entries(CONDITIONS).map(([key, c]) => (
                <div key={key} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:c.color, flexShrink:0 }} />
                  <span style={{ fontSize:12, color:"#999" }}>{c.label} — {COND_DESCS[key]}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}