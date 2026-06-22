import React, { useState, useEffect } from "react";

const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";

const SECTION_LABELS = {
  home: "Inicio",
  noticias: "Noticias",
  "noticia-detalle": "Detalle de nota",
  equipos: "Equipos",
  "equipo-detalle": "Detalle de equipo",
  fixture: "Fixture",
  posiciones: "Posiciones",
  cupones: "Cupones",
  contacto: "Contacto",
  otro: "Otras páginas",
};

const CATEGORY_LABELS = {
  A1: "FSP Masculino",
  F1: "FSP Femenino",
  "FSP Masculino": "FSP Masculino",
  "FSP Femenino": "FSP Femenino",
  Ascenso: "Ascenso",
  DH: "División de Honor",
  CM: "Copa Mendoza",
  TN: "Torneos Nacionales",
  TI: "Torneos Internacionales",
};

const DEVICE_LABELS = { desktop: "Escritorio", mobile: "Celular", tablet: "Tablet" };

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [topNotices, setTopNotices] = useState([]);
  const [sectionStats, setSectionStats] = useState({ stats: [], total: 0 });
  const [dailyViews, setDailyViews] = useState([]);
  const [totalNotices, setTotalNotices] = useState(0);
  const [days, setDays] = useState(30);

  const [authorStats, setAuthorStats] = useState([]);

  const [ga, setGa] = useState(null);
  const [gaTimeline, setGaTimeline] = useState([]);
  const [gaError, setGaError] = useState(null);

  async function fetchAllData() {
    setLoading(true);
    try {
      const [topRes, statsRes, dailyRes, noticesRes, authorRes] = await Promise.all([
        fetch(`${BASE_URL}/notices/top?limit=10`).then((r) => r.json()),
        fetch(`${BASE_URL}/pageviews/stats`).then((r) => r.json()),
        fetch(`${BASE_URL}/pageviews/by-day?days=${days}`).then((r) => r.json()),
        fetch(`${BASE_URL}/notices?admin=true&limit=1`).then((r) => r.json()),
        fetch(`${BASE_URL}/notices/stats-by-author`).then((r) => r.json()),
      ]);
      setTopNotices(topRes);
      setSectionStats(statsRes);
      setDailyViews(dailyRes);
      setTotalNotices(noticesRes.total ?? 0);
      setAuthorStats(Array.isArray(authorRes) ? authorRes : []);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }

    try {
      const [overviewRes, timelineRes] = await Promise.all([
        fetch(`${BASE_URL}/analytics/overview?days=${days}`).then((r) => r.json()),
        fetch(`${BASE_URL}/analytics/timeline?days=${days}`).then((r) => r.json()),
      ]);
      if (overviewRes.error) {
        setGaError(overviewRes.error);
      } else {
        setGa(overviewRes);
        setGaTimeline(timelineRes);
        setGaError(null);
      }
    } catch (err) {
      setGaError("No se pudo conectar con Google Analytics");
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchAllData();
  }, [days]);

  const totalViews = topNotices.reduce((sum, n) => sum + (n.views || 0), 0);
  const avgViews = totalNotices > 0 ? Math.round(totalViews / totalNotices) : 0;

  const maxSectionCount = sectionStats.stats.length > 0
    ? Math.max(...sectionStats.stats.map((s) => s.count))
    : 1;

  const maxNoticeViews = topNotices.length > 0
    ? Math.max(...topNotices.map((n) => n.views || 0))
    : 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  const avgDuration = ga?.totals?.avgSessionDuration
    ? `${Math.round(ga.totals.avgSessionDuration / 60)}m ${Math.round(ga.totals.avgSessionDuration % 60)}s`
    : "—";

  const totalDeviceUsers = ga?.devices?.reduce((s, d) => s + d.users, 0) || 1;
  const maxSourceSessions = ga?.sources?.length > 0
    ? Math.max(...ga.sources.map((s) => s.sessions))
    : 1;

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-white font-bold">Estadísticas</h1>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-lg px-2 py-1.5 bg-zinc-800 text-zinc-300 border border-white/10 text-xs focus:outline-none focus:border-orange-500"
          >
            <option value={7}>7 días</option>
            <option value={14}>14 días</option>
            <option value={28}>28 días</option>
            <option value={60}>60 días</option>
            <option value={90}>90 días</option>
          </select>
          <button
            onClick={fetchAllData}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 border border-white/10 text-zinc-300 text-sm font-medium hover:bg-zinc-700 hover:text-white transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* ── Google Analytics: Resumen ── */}
      {ga && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Usuarios únicos" value={ga.totals.activeUsers.toLocaleString()} accent />
          <StatCard label="Sesiones" value={ga.totals.sessions.toLocaleString()} />
          <StatCard label="Páginas vistas (GA)" value={ga.totals.pageViews.toLocaleString()} />
          <StatCard label="Duración promedio" value={avgDuration} />
        </div>
      )}
      {gaError && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-xl px-4 py-3 text-sm">
          Google Analytics: {gaError}
        </div>
      )}

      {/* ── Resumen Mongo ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Visitas trackeadas (Mongo)" value={sectionStats.total.toLocaleString()} />
        <StatCard label="Notas publicadas" value={totalNotices.toLocaleString()} />
        <StatCard label="Promedio vistas / nota" value={avgViews.toLocaleString()} />
      </div>

      {/* ── GA: Usuarios por día ── */}
      {gaTimeline.length > 0 && (
        <Section title={`Usuarios por día (últimos ${days} días)`}>
          <LineChart
            data={gaTimeline.map((d) => ({
              label: new Date(d.date + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", timeZone: "UTC" }),
              value: d.users,
            }))}
            color="#3b82f6"
          />
        </Section>
      )}

      {/* ── GA: Dispositivos + Fuentes + Ciudades ── */}
      {ga && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dispositivos */}
          <Section title="Dispositivos">
            <div className="flex flex-col gap-3">
              {ga.devices.map((d) => {
                const pct = Math.round((d.users / totalDeviceUsers) * 100);
                return (
                  <div key={d.device} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-300">{DEVICE_LABELS[d.device] ?? d.device}</span>
                      <span className="text-white font-bold">{pct}%</span>
                    </div>
                    <div className="bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Fuentes de tráfico */}
          <Section title="Fuentes de tráfico">
            <div className="flex flex-col gap-2">
              {ga.sources.map((s) => (
                <div key={s.source} className="flex items-center gap-2">
                  <span className="text-zinc-300 text-xs w-24 truncate flex-shrink-0">{s.source || "(directo)"}</span>
                  <div className="flex-1 bg-zinc-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-green-500/80 rounded-full"
                      style={{ width: `${Math.max((s.sessions / maxSourceSessions) * 100, 6)}%` }}
                    />
                  </div>
                  <span className="text-zinc-400 text-xs w-8 text-right flex-shrink-0">{s.sessions}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Ciudades */}
          <Section title="Ciudades">
            <div className="flex flex-col gap-1.5">
              {ga.cities.map((c, i) => (
                <div key={c.city} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 text-xs w-4 text-right">{i + 1}</span>
                    <span className="text-zinc-300 text-sm">{c.city === "(not set)" ? "No definida" : c.city}</span>
                  </div>
                  <span className="text-white text-sm font-bold">{c.users}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── Top 10 Notas ── */}
      <Section title="Top 10 notas más leídas">
        {topNotices.length === 0 ? (
          <p className="text-zinc-500 text-sm py-4">No hay datos de lectura aún</p>
        ) : (
          <div className="flex flex-col gap-2">
            {topNotices.map((notice, i) => (
              <div key={notice._id} className="flex items-center gap-3 py-2">
                <span className="text-zinc-500 font-bold text-sm w-6 text-right flex-shrink-0">
                  {i + 1}
                </span>
                {notice.images?.[0] && (
                  <img
                    src={notice.images[0]}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{notice.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${((notice.views || 0) / maxNoticeViews) * 100}%` }}
                      />
                    </div>
                    <span className="text-orange-400 text-xs font-bold flex-shrink-0 w-12 text-right">
                      {(notice.views || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                {notice.category && (
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:block">
                    {CATEGORY_LABELS[notice.category] ?? notice.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Rendimiento por notero ── */}
      {authorStats.length > 0 && (
        <Section title="Rendimiento por notero">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-2">
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 gap-y-2 items-center text-xs text-zinc-500 uppercase tracking-widest font-semibold pb-2 border-b border-white/5">
                <span></span>
                <span>Notero</span>
                <span className="text-right">Notas</span>
                <span className="text-right">Vistas</span>
                <span className="text-right">Prom.</span>
              </div>
              {authorStats.map((a, i) => {
                const avg = a.totalNotas > 0 ? Math.round(a.totalVistas / a.totalNotas) : 0;
                return (
                  <div key={a._id} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-zinc-500 font-bold text-sm w-5 text-right">{i + 1}</span>
                    <div className="flex items-center gap-2 min-w-0">
                      {a.image ? (
                        <img src={a.image} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-zinc-400 text-xs font-bold">{(a._id || "?")[0]}</span>
                        </div>
                      )}
                      <span className="text-white text-sm font-medium truncate">{a._id || "Sin autor"}</span>
                    </div>
                    <span className="text-zinc-300 text-sm font-bold text-right w-12">{a.totalNotas}</span>
                    <span className="text-orange-400 text-sm font-bold text-right w-16">{a.totalVistas.toLocaleString()}</span>
                    <span className="text-zinc-400 text-xs text-right w-12">{avg.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-3">Participación en vistas</p>
              <DonutChart data={authorStats.map((a) => ({ label: a._id || "Sin autor", value: a.totalVistas }))} />
            </div>
          </div>
          {authorStats.some((a) => a.topNota?.title) && (
            <div className="mt-5 pt-4 border-t border-white/5">
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-3">Nota más leída por notero</p>
              <div className="flex flex-col gap-2">
                {authorStats.filter((a) => a.topNota?.title).map((a) => (
                  <div key={a._id} className="flex items-center gap-3">
                    <span className="text-zinc-400 text-xs w-28 truncate flex-shrink-0">{a._id || "Sin autor"}</span>
                    <span className="text-white text-sm truncate flex-1">{a.topNota.title}</span>
                    <span className="text-orange-400 text-xs font-bold flex-shrink-0">{(a.topNota.views || 0).toLocaleString()} vistas</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* ── Visitas por sección (Mongo) ── */}
      <Section title="Visitas por sección">
        {sectionStats.stats.length === 0 ? (
          <p className="text-zinc-500 text-sm py-4">No hay datos de visitas aún</p>
        ) : (
          <div className="flex flex-col gap-3">
            {sectionStats.stats.map((s) => (
              <div key={s._id} className="flex items-center gap-3">
                <span className="text-zinc-300 text-sm font-medium w-36 flex-shrink-0 truncate">
                  {SECTION_LABELS[s._id] ?? s._id}
                </span>
                <div className="flex-1 bg-zinc-800 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-orange-500/80 rounded-full flex items-center justify-end pr-2 transition-all"
                    style={{ width: `${Math.max((s.count / maxSectionCount) * 100, 8)}%` }}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {s.count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Visitas por día (Mongo) ── */}
      <Section title={`Visitas por día — Mongo (últimos ${days} días)`}>
        {dailyViews.length === 0 ? (
          <p className="text-zinc-500 text-sm py-4">No hay datos de visitas aún</p>
        ) : (
          <LineChart
            data={dailyViews.map((d) => ({
              label: new Date(d._id + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", timeZone: "UTC" }),
              value: d.count,
            }))}
            color="#f97316"
          />
        )}
      </Section>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`border rounded-xl p-5 flex flex-col gap-1 ${accent ? "bg-blue-950/30 border-blue-500/20" : "bg-zinc-900 border-white/10"}`}>
      <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">{label}</span>
      <span className={`text-3xl font-black ${accent ? "text-blue-400" : "text-white"}`}>{value}</span>
    </div>
  );
}

function Section({ title, extra, children }) {
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest">{title}</p>
        {extra}
      </div>
      {children}
    </div>
  );
}

function LineChart({ data, color = "#f97316", height = 200 }) {
  if (!data || data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 40, left: 45 };
  const viewW = 700;
  const viewH = height;
  const chartW = viewW - padding.left - padding.right;
  const chartH = viewH - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1);
  const niceMax = Math.ceil(maxVal / (10 ** (String(Math.ceil(maxVal)).length - 1))) * (10 ** (String(Math.ceil(maxVal)).length - 1)) || maxVal;

  const points = data.map((d, i) => ({
    x: padding.left + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW),
    y: padding.top + chartH - (d.value / niceMax) * chartH,
    label: d.label,
    value: d.value,
  }));

  const ticks = 5;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => Math.round((niceMax / ticks) * i));

  const labelStep = Math.max(1, Math.ceil(data.length / 12));
  const xLabels = data.filter((_, i) => i % labelStep === 0 || i === data.length - 1);

  let pathD = "";
  if (points.length === 1) {
    pathD = "";
  } else {
    pathD = points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x},${p.y}`;
      const prev = points[i - 1];
      const cpx = (prev.x + p.x) / 2;
      return `${acc} C ${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
    }, "");
  }

  const areaD = pathD
    ? `${pathD} L ${points[points.length - 1].x},${padding.top + chartH} L ${points[0].x},${padding.top + chartH} Z`
    : "";

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full" style={{ minWidth: 400 }}>
        {yTicks.map((tick) => {
          const y = padding.top + chartH - (tick / niceMax) * chartH;
          return (
            <g key={tick}>
              <line x1={padding.left} y1={y} x2={viewW - padding.right} y2={y} stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="4 3" />
              <text x={padding.left - 8} y={y + 3} textAnchor="end" fill="#a1a1aa" fontSize="10">{tick.toLocaleString()}</text>
            </g>
          );
        })}

        {xLabels.map((d) => {
          const idx = data.indexOf(d);
          const pt = points[idx];
          if (!pt) return null;
          return (
            <text key={d.label} x={pt.x} y={viewH - 6} textAnchor="middle" fill="#a1a1aa" fontSize="9">{d.label}</text>
          );
        })}

        {areaD && (
          <path d={areaD} fill={color} opacity="0.08" />
        )}

        {pathD && (
          <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {points.map((p, i) => (
          <g key={i} className="group">
            <circle cx={p.x} cy={p.y} r="10" fill="transparent" className="cursor-default" />
            <circle cx={p.x} cy={p.y} r="3" fill={color} stroke="#18181b" strokeWidth="1.5" />
            <g className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ pointerEvents: "none" }}>
              <rect x={p.x - 30} y={p.y - 26} width="60" height="18" rx="4" fill="#3f3f46" />
              <text x={p.x} y={p.y - 14} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{p.value.toLocaleString()}</text>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}

const DONUT_COLORS = ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ef4444", "#eab308", "#06b6d4", "#ec4899"];

function DonutChart({ data, size = 180 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 10;
  const innerR = r * 0.58;

  let cumAngle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const angle = pct * 2 * Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const largeArc = angle > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(endAngle);
    const iy1 = cy + innerR * Math.sin(endAngle);
    const ix2 = cx + innerR * Math.cos(startAngle);
    const iy2 = cy + innerR * Math.sin(startAngle);
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
    return { ...d, path, color: DONUT_COLORS[i % DONUT_COLORS.length], pct };
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((s, i) => (
          <g key={i} className="group">
            <path d={s.path} fill={s.color} className="hover:opacity-80 transition-opacity cursor-default" stroke="#18181b" strokeWidth="1.5" />
            <title>{s.label}: {Math.round(s.pct * 100)}%</title>
          </g>
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">{total.toLocaleString()}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#a1a1aa" fontSize="9">vistas totales</text>
      </svg>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-zinc-400 text-[10px] truncate max-w-[80px]">{s.label}</span>
            <span className="text-zinc-500 text-[10px]">{Math.round(s.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
