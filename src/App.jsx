import { useState, useEffect, useRef } from "react";

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
  const d = new Date(iso + "T12:00:00");
  const today = new Date();
  const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate());
  const prefix = iso === todayIso ? "Hoje, " : `${PT_DAYS_FULL[d.getDay()]}, `;
  return `${prefix}${d.getDate()} de ${PT_MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
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
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const viewMonthMaxIso = isoDate(view.y, view.m, daysInMonth);
  const viewMonthMinIso = isoDate(view.y, view.m, 1);
  const canGoPrev = viewMonthMinIso > todayIso;
  const canGoNext = viewMonthMaxIso < maxIso;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <button onClick={() => setView(v => v.m===0?{y:v.y-1,m:11}:{y:v.y,m:v.m-1})} style={{ ...navBtn, opacity: canGoPrev?1:0.2, cursor: canGoPrev?"pointer":"default" }} disabled={!canGoPrev}>‹</button>
        <span style={{ fontSize:14, fontWeight:600, color:"#111" }}>{PT_MONTHS[view.m]} {view.y}</span>
        <button onClick={() => setView(v => v.m===11?{y:v.y+1,m:0}:{y:v.y,m:v.m+1})} style={{ ...navBtn, opacity: canGoNext?1:0.2, cursor: canGoNext?"pointer":"default" }} disabled={!canGoNext}>›</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:6 }}>
        {PT_DAYS_SHORT.map(d => (
          <div key={d} style={{ textAlign:"center", fontSize:11, color:"#999", fontWeight:500 }}>{d}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const iso = isoDate(view.y, view.m, d);
          const isSelected = selected === iso;
          const isToday = iso === todayIso;
          const disabled = iso < todayIso || iso > maxIso;
          return (
            <button key={iso} onClick={() => !disabled && onSelect(iso)} style={{
              aspectRatio:"1", borderRadius:8,
              border: isSelected ? "2px solid #111" : "2px solid transparent",
              background: isSelected ? "#111" : "transparent",
              color: disabled ? "#ccc" : isSelected ? "#fff" : "#111",
              fontWeight: isToday ? 700 : 400,
              fontSize:13, cursor: disabled ? "default" : "pointer",
            }}>{d}</button>
          );
        })}
      </div>
      <div style={{ fontSize:11, color:"#bbb", marginTop:14, textAlign:"center" }}>
        Previsão disponível para os próximos 14 dias
      </div>
    </div>
  );
}

const navBtn = {
  background:"none", border:"1.5px solid #e0e0e0", borderRadius:8,
  width:32, height:32, cursor:"pointer", fontSize:18, color:"#111",
};

async function fetchForecast(beach, date) {
  const res = await fetch(`${API_BASE}/forecast?beach=${encodeURIComponent(beach)}&date=${date}`);
  if (!res.ok) throw new Error("Erro na API");
  return res.json();
}

function BeachSearch({ onSelect, selectedBeach }) {
  const [query, setQuery] = useState(selectedBeach || "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Sincroniza o texto quando a praia muda externamente
  useEffect(() => {
    setQuery(selectedBeach || "");
  }, [selectedBeach]);

  // Fecha dropdown ao clicar fora
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
    if (b === selectedBeach && !query) return false;
    if (!query || query === selectedBeach) return b !== selectedBeach;
    return b.toLowerCase().includes(query.toLowerCase()) && b !== selectedBeach;
  });

  const handleFocus = () => {
    setQuery("");
    setOpen(true);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
  };

  const handlePick = (b) => {
    onSelect(b);
    setQuery(b);
    setOpen(false);
  };

  return (
    <div ref={containerRef} style={{ flex:1, position:"relative" }}>
      <input
        type="text"
        placeholder="Buscar praia..."
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        style={{
          width:"100%", padding:"13px 16px", borderRadius:10,
          border:"2px solid #e0e0e0", fontSize:14, color:"#111",
          outline:"none", boxSizing:"border-box", background:"#fff",
        }}
      />
      {open && filtered.length > 0 && (
        <div style={{
          position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:20,
          background:"#fff", border:"1.5px solid #e0e0e0", borderRadius:10,
          overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,0.08)",
        }}>
          {filtered.map(b => (
            <div key={b} onMouseDown={() => handlePick(b)} style={{
              padding:"12px 16px", fontSize:14, color:"#111", cursor:"pointer",
              borderBottom:"1px solid #f0f0f0",
            }}
              onMouseEnter={e => e.currentTarget.style.background="#f7f7f7"}
              onMouseLeave={e => e.currentTarget.style.background="#fff"}
            >{b}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const today = new Date();
  const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate());

  const [beach, setBeach] = useState(null);
  const [selectedDay, setSelectedDay] = useState(todayIso);
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempDay, setTempDay] = useState(todayIso);

  const [beachData, setBeachData] = useState(null);
  const [beachLoading, setBeachLoading] = useState(false);
  const [beachError, setBeachError] = useState(null);

  const [goodBeaches, setGoodBeaches] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const selectBeach = (b) => { setBeach(b); setBeachData(null); };
  const openCalendar = () => { setTempDay(selectedDay); setShowCalendar(true); };
  const handleApply = () => { setSelectedDay(tempDay); setShowCalendar(false); };
  const handleCancel = () => setShowCalendar(false);

  useEffect(() => {
    if (!beach) return;
    setBeachLoading(true);
    setBeachError(null);
    fetchForecast(beach, selectedDay)
      .then(d => { setBeachData(d); setBeachLoading(false); })
      .catch(() => { setBeachError("Não foi possível carregar os dados."); setBeachLoading(false); });
  }, [beach, selectedDay]);

  useEffect(() => {
    if (beach) return;
    setListLoading(true);
    Promise.all(BEACHES.map(b => fetchForecast(b, selectedDay).catch(() => null)))
      .then(results => {
        const good = results
          .map((d, i) => d ? { ...d, beach: BEACHES[i] } : null)
          .filter(d => d && d.cond === "bom");
        setGoodBeaches(good);
        setListLoading(false);
      });
  }, [beach, selectedDay]);

  const cond = beachData ? CONDITIONS[beachData.cond] : null;

  return (
    <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"'Inter', sans-serif", display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 16px 80px" }}>

      <div style={{ textAlign:"center", marginBottom:40, width:"100%", maxWidth:440 }}>
        <div style={{ fontSize:11, color:"#999", fontWeight:500, marginBottom:8 }}>Swell check</div>
        <div style={{ fontSize:26, fontWeight:700, color:"#111" }}>Previsão para Surf</div>
      </div>

      <div style={{ width:"100%", maxWidth:440, marginBottom:8 }}>
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

      <div style={{ width:"100%", maxWidth:440, marginTop:24 }}>
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
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                {[
                  { label:"Altura",  value:`${beachData.height}m` },
                  { label:"Vento",   value:`${beachData.windSpeed} km/h ${beachData.windDir}` },
                  { label:"Período", value:`${beachData.period}s` },
                ].map(item => (
                  <div key={item.label} style={{ background:"#f7f7f7", borderRadius:10, padding:"12px" }}>
                    <div style={{ fontSize:11, color:"#999", fontWeight:500, marginBottom:6 }}>{item.label}</div>
                    <div style={{ fontSize:15, fontWeight:600, color:"#111" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        ) : (
          <div>
            <div style={{ fontSize:13, color:"#999", fontWeight:500, marginBottom:12 }}>
              Bom para surfar em {parseDateLabel(selectedDay).toLowerCase()}
            </div>
            {listLoading ? (
              <div style={{ fontSize:14, color:"#bbb", textAlign:"center", padding:"32px 0" }}>Carregando...</div>
            ) : goodBeaches.length === 0 ? (
              <div style={{ fontSize:14, color:"#bbb" }}>Nenhuma praia com boas condições para o dia selecionado.</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {goodBeaches.map(d => {
                  const c = CONDITIONS[d.cond];
                  return (
                    <div key={d.beach} onClick={() => selectBeach(d.beach)} style={{
                      border:"1.5px solid #e0e0e0", borderRadius:12, padding:"16px",
                      cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background="#f7f7f7"}
                      onMouseLeave={e => e.currentTarget.style.background="#fff"}
                    >
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ width:10, height:10, borderRadius:"50%", background:c.color, flexShrink:0 }} />
                        <span style={{ fontSize:15, fontWeight:600, color:"#111" }}>{d.beach}</span>
                      </div>
                      <div style={{ display:"flex", gap:16 }}>
                        <span style={{ fontSize:13, color:"#999" }}>{d.height}m</span>
                        <span style={{ fontSize:13, color:"#999" }}>{d.period}s</span>
                        <span style={{ fontSize:13, color:"#999" }}>{d.windSpeed} km/h {d.windDir}</span>
                      </div>
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
            width:"100%", maxWidth:360, boxShadow:"0 8px 32px rgba(0,0,0,0.16)",
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

      <div style={{ width:"100%", maxWidth:440, marginTop:"auto", paddingTop:48 }}>
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
  );
}
