import { useState, useEffect, useRef } from "react";
import { Chart, LineElement, PointElement, LineController, CategoryScale, LinearScale, Filler } from "chart.js";
Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Filler);

const BEACHES = ["Paiva", "Itapuama", "Porto de Galinhas", "Maracaípe"];
const API_BASE = "https://swellcheck.vercel.app";

const CONDITIONS = {
  flat:   { label: "Flat",   desc: "Não vale a pena", color: "#a07850" },
  marola: { label: "Marola", desc: "Vai depender",     color: "#c8a800" },
  bom:    { label: "Bom",    desc: "Vai surfar!",       color: "#2e9e6a" },
  storm:  { label: "Storm",  desc: "Cuidado",           color: "#d04040" },
};

const PT_DAYS_FULL  = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const PT_MONTHS     = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const PT_DAYS_SHORT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

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

function NavButton({ onClick, disabled, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:36, height:36, borderRadius:8, flexShrink:0,
        border: disabled ? "1.5px solid #e8e8e8" : hovered ? "1.5px solid #111" : "1.5px solid #d0d0d0",
        background: disabled ? "#fafafa" : hovered ? "#f7f7f7" : "#fff",
        color: disabled ? "#ccc" : "#111",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize:20, display:"flex", alignItems:"center", justifyContent:"center",
        transition:"border 0.12s, background 0.12s, color 0.12s",
      }}
    >{children}</button>
  );
}

function Calendar({ selected, onSelect }) {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate());
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);
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
        {PT_DAYS_SHORT.map(dayLabel => (
          <div key={dayLabel} style={{ textAlign:"center", fontSize:11, color:"#999", fontWeight:500 }}>{dayLabel}</div>
        ))}
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

function TideChart({ tides }) {
  const canvasRef = useRef(null);
  const labelsRef = useRef(null);

  useEffect(() => {
    if (!tides || !canvasRef.current) return;

    const points = tides.map(t => {
      const [h, m] = t.hour.split(":").map(Number);
      return { hour: h + m / 60, level: t.level, high: t.level > 1.2 };
    });

    const steps = 97;
    const data = [];
    for (let i = 0; i < steps; i++) {
      const h = i / (steps - 1) * 24;
      let num = 0, den = 0;
      for (const p of points) {
        const d = Math.abs(h - p.hour);
        const w = Math.exp(-d * d / 7);
        num += p.level * w; den += w;
      }
      data.push(parseFloat((num / den).toFixed(3)));
    }

    const chart = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: "#111",
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
          backgroundColor: "rgba(0,0,0,0.06)",
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false },
          y: { display: false, min: 0.1, max: 2.6 }
        },
        animation: {
          onComplete: () => {
            if (!labelsRef.current) return;
            labelsRef.current.innerHTML = "";
            const area = chart.chartArea;
            const yScale = chart.scales.y;
            const W = area.right - area.left;
            points.forEach(p => {
              const x = area.left + (p.hour / 24) * W;
              const y = yScale.getPixelForValue(p.level);
              const dot = document.createElement("div");
              dot.style.cssText = `position:absolute;width:5px;height:5px;background:#111;border-radius:50%;transform:translate(-50%,-50%);left:${x}px;top:${y}px;`;
              labelsRef.current.appendChild(dot);
            });
          }
        }
      }
    });

    return () => chart.destroy();
  }, [tides]);

  if (!tides) return null;
  const points = tides.map(t => ({ ...t, high: t.level > 1.2 }));

  return (
    <div>
      <div style={{ position:"relative", width:"100%", height:90 }}>
        <canvas ref={canvasRef} />
        <div ref={labelsRef} style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none" }} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${points.length}, 1fr)`, gap:4, marginTop:12 }}>
        {points.map((t, i) => (
          <div key={i} style={{ textAlign:"center" }}>
            <div style={{ fontSize:10, color:"#999" }}>{t.high ? "↑ Alta" : "↓ Baixa"}</div>
            <div style={{ fontSize:12, fontWeight:600, color:"#111" }}>{t.hour}</div>
          </div>
        ))}
      </div>
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
        setOpen(false);
        setQuery(selectedBeach || "");
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
      <input
        type="text"
        placeholder="Buscar praia..."
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        style={{
          width:"100%", padding:"13px 40px 13px 16px", borderRadius:10,
          border:"2px solid #e0e0e0", fontSize:14, color:"#111",
          outline:"none", boxSizing:"border-box", background:"#fff",
        }}
      />
      {selectedBeach && (
        <button onMouseDown={handleClear} style={{
          position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
          background:"none", border:"none", cursor:"pointer",
          color:"#bbb", fontSize:18, lineHeight:1, padding:2,
        }}>×</button>
      )}
      {open && filtered.length > 0 && (
        <div style={{
          position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:20,
          background:"#fff", border:"1.5px solid #e0e0e0", borderRadius:10,
          overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,0.08)",
        }}>
          {filtered.map(b => {
            const isActive = b === selectedBeach;
            return (
              <div key={b} onMouseDown={() => handlePick(b)} style={{
                padding:"12px 16px", fontSize:14, color:"#111", cursor:"pointer",
                borderBottom:"1px solid #f0f0f0",
                background: isActive ? "#f7f7f7" : "#fff",
                display:"flex", alignItems:"center", justifyContent:"space-between",
              }}
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

async function fetchTide(date) {
  const res = await fetch(`${API_BASE}/tide?date=${date}`);
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

  const [beach, setBeach] = useState(null);
  const [selectedDay, setSelectedDay] = useState(todayIso);
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempDay, setTempDay] = useState(todayIso);
  const [beachData, setBeachData] = useState(null);
  const [beachLoading, setBeachLoading] = useState(false);
  const [beachError, setBeachError] = useState(null);
  const [tideData, setTideData] = useState(null);
  const [goodBeaches, setGoodBeaches] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const selectBeach = (b) => { setBeach(b); setBeachData(null); setTideData(null); if (!b) setGoodBeaches([]); };
  const openCalendar = () => { setTempDay(selectedDay); setShowCalendar(true); };
  const handleApply = () => { setSelectedDay(tempDay); setShowCalendar(false); };
  const handleCancel = () => setShowCalendar(false);

  const COND_ORDER = { storm: 0, bom: 1, marola: 2, flat: 3 };

  useEffect(() => {
    if (!beach) return;
    setBeachLoading(true);
    setBeachError(null);
    Promise.all([
      fetchForecast(beach, selectedDay),
      fetchTide(selectedDay),
    ])
      .then(([forecast, tide]) => {
        setBeachData(forecast);
        setTideData(tide);
        setBeachLoading(false);
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
        setGoodBeaches(all);
        setListLoading(false);
      });
  }, [beach, selectedDay]);

  const cond = beachData ? CONDITIONS[beachData.cond] : null;

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
              <button onClick={openCalendar} style={{
                flexShrink:0, padding:"0 16px", borderRadius:10,
                border:"2px solid #111", background:"#111", color:"#fff",
                fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap",
              }}>Filtrar por data</button>
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
              ) : beachData && cond ? (
                <div style={{ border:"1.5px solid #e0e0e0", borderRadius:14, padding:"24px 20px" }}>
                  <div style={{ fontSize:12, color:"#999", marginBottom:16 }}>{parseDateLabel(selectedDay)}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
                    <span style={{ width:12, height:12, borderRadius:"50%", background:cond.color, flexShrink:0 }} />
                    <span style={{ fontSize:28, fontWeight:700, color:"#111" }}>{cond.label}</span>
                    <span style={{ fontSize:14, color:"#777" }}>{cond.desc}</span>
                  </div>
                  <div style={{ height:1, background:"#f0f0f0", marginBottom:20 }} />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    {[
                      { label:"Altura total",     value:`${beachData.height}m` },
                      { label:"Vento",            value:`${beachData.windSpeed} km/h ${beachData.windDir} (${beachData.windType === "offshore" ? "terral" : beachData.windType === "onshore" ? "maral" : "lateral"})` },
                      { label:"Swell",            value:`${beachData.swellHeight}m · ${beachData.swellDir}` },
                      { label:"Período do swell", value:`${beachData.swellPeriod}s` },
                    ].map(item => (
                      <div key={item.label} style={{ background:"#f7f7f7", borderRadius:10, padding:"12px" }}>
                        <div style={{ fontSize:11, color:"#999", fontWeight:500, marginBottom:6 }}>{item.label}</div>
                        <div style={{ fontSize:15, fontWeight:600, color:"#111" }}>{item.value}</div>
                      </div>
                    ))}
                    {(() => {
                      const energy = beachData.swellEnergy ?? 0;
                      const kj = beachData.swellKj ?? 0;
                      const barColor = energy <= 3 ? "#a07850" : energy <= 5 ? "#c8a800" : energy <= 8 ? "#2e9e6a" : "#d04040";
                      return (
                        <div style={{ gridColumn:"1 / -1", background:"#f7f7f7", borderRadius:10, padding:"12px" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                            <div style={{ fontSize:11, color:"#999", fontWeight:500 }}>Força do swell</div>
                            <div style={{ fontSize:15, fontWeight:700, color:"#111" }}>
                              {kj} J <span style={{ fontSize:11, color:"#bbb", fontWeight:400 }}>· {energy}/10</span>
                            </div>
                          </div>
                          <div style={{ background:"#e8e8e8", borderRadius:99, height:6, overflow:"hidden" }}>
                            <div style={{ width:`${energy * 10}%`, background:barColor, height:"100%", borderRadius:99 }} />
                          </div>
                          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                            <span style={{ fontSize:11, color:"#bbb" }}>Fraco</span>
                            <span style={{ fontSize:11, color:"#bbb" }}>Muito forte</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  {tideData && (
                    <>
                      <div style={{ height:1, background:"#f0f0f0", margin:"20px 0" }} />
                      <div style={{ fontSize:11, color:"#999", marginBottom:12 }}>Maré</div>
                      <TideChart tides={tideData.tides} />
                    </>
                  )}
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
                        <div key={beach2.beach} onClick={() => selectBeach(beach2.beach)} style={{
                          border:"1.5px solid #e0e0e0", borderRadius:12, padding:"14px 16px",
                          cursor:"pointer", display:"grid", alignItems:"center",
                          gridTemplateColumns:"72px 1fr auto auto",
                          gap:12, background:"#fff",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background="#f7f7f7"}
                          onMouseLeave={e => e.currentTarget.style.background="#fff"}
                        >
                          <span style={{
                            display:"flex", alignItems:"center", gap:6,
                            fontSize:12, fontWeight:600, color:c.color,
                            background: c.color + "18", borderRadius:20,
                            padding:"4px 10px",
                          }}>
                            <span style={{ width:7, height:7, borderRadius:"50%", background:c.color, flexShrink:0 }} />
                            {c.label}
                          </span>
                          <span style={{ fontSize:15, fontWeight:600, color:"#111" }}>{beach2.beach}</span>
                          <span style={{ fontSize:13, color:"#bbb", textAlign:"right" }}>{beach2.height}m</span>
                          <span style={{ fontSize:13, color:"#bbb", textAlign:"right" }}>{beach2.windSpeed} km/h {beach2.windDir}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {showCalendar && (
            <div onClick={handleCancel} style={{
              position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:100,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <div onClick={e => e.stopPropagation()} style={{
                background:"#fff", borderRadius:16, padding:"24px 20px",
                width:"100%", maxWidth:360, margin:"0 16px",
                boxShadow:"0 8px 32px rgba(0,0,0,0.16)",
              }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                  <span style={{ fontSize:14, fontWeight:600, color:"#111" }}>Filtrar por data</span>
                  <button onClick={handleCancel} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#999", lineHeight:1 }}>×</button>
                </div>
                <div style={{ marginBottom:16 }}>
                  <button onClick={() => setTempDay(todayIso)} style={{
                    padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600,
                    border:"2px solid #111", background: tempDay === todayIso ? "#111" : "#fff",
                    color: tempDay === todayIso ? "#fff" : "#111",
                  }}>Hoje</button>
                </div>
                <Calendar selected={tempDay} onSelect={setTempDay} />
                <div style={{ display:"flex", gap:8, marginTop:20 }}>
                  <button onClick={handleCancel} style={{
                    flex:1, padding:"12px", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:600,
                    border:"2px solid #e0e0e0", background:"#fff", color:"#111",
                  }}>Cancelar</button>
                  <button onClick={handleApply} style={{
                    flex:1, padding:"12px", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:600,
                    border:"2px solid #111", background:"#111", color:"#fff",
                  }}>Aplicar</button>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop:"auto", paddingTop:48 }}>
            <div style={{ height:1, background:"#f0f0f0", marginBottom:16 }} />
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {Object.values(CONDITIONS).map(c => (
                <div key={c.label} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:c.color, flexShrink:0 }} />
                  <span style={{ fontSize:12, color:"#999" }}>{c.label} — {c.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}