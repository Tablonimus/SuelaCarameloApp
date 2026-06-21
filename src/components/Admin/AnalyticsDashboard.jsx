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

  const [ga, setGa] = useState(null);
  const [gaTimeline, setGaTimeline] = useState([]);
  const [gaError, setGaError] = useState(null);

  async function fetchAllData() {
    setLoading(true);
    try {
      const [topRes, statsRes, dailyRes, noticesRes] = await Promise.all([
        fetch(`${BASE_URL}/notices/top?limit=10`).then((r) => r.json()),
        fetch(`${BASE_URL}/pageviews/stats`).then((r) => r.json()),
        fetch(`${BASE_URL}/pageviews/by-day?days=${days}`).then((r) => r.json()),
        fetch(`${BASE_URL}/notices?admin=true&limit=1`).then((r) => r.json()),
      ]);
      setTopNotices(topRes);
      setSectionStats(statsRes);
      setDailyViews(dailyRes);
      setTotalNotices(noticesRes.total ?? 0);
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

  const maxDailyCount = dailyViews.length > 0
    ? Math.max(...dailyViews.map((d) => d.count))
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

  const maxTimelineUsers = gaTimeline.length > 0
    ? Math.max(...gaTimeline.map((d) => d.users))
    : 1;

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
          <div className="flex items-end gap-[2px] h-40 mt-2">
            {gaTimeline.map((d) => {
              const pct = Math.max((d.users / maxTimelineUsers) * 100, 4);
              const dateStr = new Date(d.date + "T12:00:00").toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                timeZone: "UTC",
              });
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  <div className="absolute -top-6 bg-zinc-700 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {dateStr}: {d.users} usuarios
                  </div>
                  <div
                    className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-400 transition-colors cursor-default min-w-[4px]"
                    style={{ height: `${pct}%` }}
                  />
                </div>
              );
            })}
          </div>
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
          <div className="flex items-end gap-[2px] h-40 mt-2">
            {dailyViews.map((d) => {
              const pct = Math.max((d.count / maxDailyCount) * 100, 4);
              const dateStr = new Date(d._id + "T12:00:00").toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                timeZone: "UTC",
              });
              return (
                <div key={d._id} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  <div className="absolute -top-6 bg-zinc-700 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {dateStr}: {d.count}
                  </div>
                  <div
                    className="w-full bg-orange-500 rounded-t-sm hover:bg-orange-400 transition-colors cursor-default min-w-[4px]"
                    style={{ height: `${pct}%` }}
                  />
                </div>
              );
            })}
          </div>
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
