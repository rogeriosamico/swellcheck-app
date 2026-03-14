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
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);
  const maxIso = isoDate(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <NavButton onClick={() => setView(v => v.m===0?{y:v.y-1,m:11}:{y:v.y,m:v.m-1})} disabled={false}>‹</NavButton>
        <span style={{ fontSize:14, fontWeight:600, color:"#111" }}>{PT_MONTHS[view.m]} {view.y}</span>
        <NavButton onClick={() => setView(v => v.m===11?{y:v.y+1,m:0}:{y:v.y,m:v.m+1})} disabled={false}>›</NavButton>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:4 }}>
        {PT_DAYS_SHORT.map(d => (
          <div key={d} style={{ textAlign:"center", fontSize:11, color:"#999", fontWeight:500, paddingBottom:8 }}>{d}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const iso = isoDate(view.y, view.m, d);
          const isSelected = selected === iso;
          const isToday = iso === todayIso;
          const disabled = iso < todayIso || iso > maxIso;
          return (
            <button key={iso} onClick={() => !disabled && onSelect(iso)} style={{
              aspectRatio:"1/1", width:"100%", borderRadius:8,
              border: isSelected ? "2px solid #111" : "2px solid transparent",
              background: isSelected ? "#111" : "transparent",
              color: disabled ? "#ccc" : isSelected ? "#fff" : "#111",
              fontWeight: isToday ?
