const PT_DAYS_FULL  = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const PT_DAYS_SHORT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const PT_MONTHS       = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const PT_MONTHS_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function isoDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function getToday() {
  const t = new Date();
  return isoDate(t.getFullYear(), t.getMonth(), t.getDate());
}

export function getMaxDay() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return isoDate(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(iso, n) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return isoDate(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isValidDate(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return iso >= getToday() && iso <= getMaxDay();
}

export function parseDateLabel(iso) {
  const d = new Date(iso + "T12:00:00");
  const prefix = iso === getToday() ? "Hoje, " : `${PT_DAYS_FULL[d.getDay()]}, `;
  return `${prefix}${d.getDate()} de ${PT_MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

export function shortDateLabel(iso) {
  if (iso === getToday()) return "Hoje";
  const d = new Date(iso + "T12:00:00");
  return `${PT_DAYS_SHORT[d.getDay()]}, ${d.getDate()}/${PT_MONTHS_SHORT[d.getMonth()]}`;
}

export function fmtHr(hr) {
  if (hr === 0 || hr === 24) return "12am";
  if (hr === 12) return "12pm";
  return hr < 12 ? `${hr}am` : `${hr - 12}pm`;
}

export function weekdayAndDateLabel(iso) {
  const d = new Date(iso + "T12:00:00");
  const day = d.getDay();
  const weekdayName = (day === 0 || day === 6) ? PT_DAYS_FULL[day] : `${PT_DAYS_FULL[day]}-feira`;
  const weekday = iso === getToday() ? `${weekdayName} (Hoje)` : weekdayName;
  const date = `${d.getDate()} de ${PT_MONTHS[d.getMonth()]}`;
  return { weekday, date };
}

export function shortRangeLabel(startIso, endIso) {
  const s = new Date(startIso + "T12:00:00");
  const e = new Date(endIso + "T12:00:00");
  return s.getMonth() === e.getMonth()
    ? `${s.getDate()} - ${e.getDate()} de ${PT_MONTHS[e.getMonth()]}`
    : `${s.getDate()} de ${PT_MONTHS[s.getMonth()]} - ${e.getDate()} de ${PT_MONTHS[e.getMonth()]}`;
}
