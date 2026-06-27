import React, { useState, useEffect } from "react";
import axios from "axios";
import FixtureForm from "./FixtureForm";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const LIMIT        = 15;
const TOURNEY_ORDER = ["Apertura", "Clausura", "Torneo Anual"];
const CONFIG_URL   = "https://suela-caramelo-app-back-end.vercel.app/sc/configs";

const CATEGORY_LABELS = {
  A1: "FSP Masculino", F1: "FSP Femenino",
  A2: "Segunda Div.",  F2: "Femenino B",
  DH: "DH", TI: "TI", TN: "TN", CM: "CM",
};

const FixturesManager = () => {
  const [fixtures, setFixtures]                   = useState([]);
  const [activeFixtures, setActiveFixtures]       = useState([]);
  const [activeTournamentConfig, setActiveTournamentConfig] = useState(null); // from configs collection
  const [seasons, setSeasons]                     = useState([]);
  const [tournaments, setTournaments]             = useState([]);
  const [categoryAllCache, setCategoryAllCache]   = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [error, setError]               = useState(null);
  const [success, setSuccess]           = useState(null);
  const [showModal, setShowModal]       = useState(false);
  const [editingFixture, setEditingFixture] = useState(null);
  const [filters, setFilters]           = useState({ category: "FSP Masculino", season: "", tournament: "" });
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [fixturesCache, setFixturesCache] = useState([]);

  const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc/fixtures";

  const fetchActiveFixtures = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/active`);
      setActiveFixtures(res.data);
    } catch {}
  };

  const applyPage = (all, targetPage) => {
    const start = (targetPage - 1) * LIMIT;
    setFixtures(all.slice(start, start + LIMIT));
    setTotalPages(Math.max(1, Math.ceil(all.length / LIMIT)));
  };

  const fetchFixtures = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category)   params.append("category",   filters.category);
      if (filters.season)     params.append("season",     filters.season);
      if (filters.tournament) params.append("tournament", filters.tournament);
      const response = await axios.get(`${BASE_URL}?${params.toString()}`);
      const all = response.data.fixtures ?? [];
      setFixturesCache(all);
      setSeasons(response.data.seasons);
      setTournaments(response.data.tournaments);
      setPage(1);
      applyPage(all, 1);
    } catch {
      setError("Error al cargar los fixtures");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryAll = async (cat) => {
    try {
      const res = await axios.get(`${BASE_URL}?category=${cat}`);
      setCategoryAllCache(res.data.fixtures ?? []);
    } catch {}
  };

  const fetchActiveTournamentConfig = async () => {
    try {
      const res = await axios.get(`${CONFIG_URL}/active-tournament`);
      setActiveTournamentConfig(res.data);
    } catch {}
  };

  useEffect(() => { fetchFixtures(); }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { fetchActiveFixtures(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!fixturesCache.length) return;
    applyPage(fixturesCache, page);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchCategoryAll(filters.category);
  }, [filters.category]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchActiveTournamentConfig();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Build all available tournament+season combos for the Torneo Activo selector
  const tournamentOptions = (() => {
    const result = [];
    const allSeasons = [...new Set(categoryAllCache.map((f) => f.season))].sort().reverse();
    for (const s of allSeasons) {
      for (const t of TOURNEY_ORDER) {
        if (categoryAllCache.some((f) => f.tournament === t && f.season === s)) {
          result.push({ key: `${t}-${s}`, label: `${t} ${s}`, tournament: t, season: s });
        }
      }
    }
    return result;
  })();

  const handleSetActive = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/${id}/activate`);
      fetchFixtures();
      fetchActiveFixtures();
      fetchCategoryAll(filters.category);
      setSuccess("Fixture activado correctamente");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Error al activar el fixture");
    }
  };

  const handleActivateTournament = async (opt) => {
    try {
      const res = await axios.patch(`${CONFIG_URL}/active-tournament`, {
        tournament: opt.tournament,
        season:     opt.season,
      });
      setActiveTournamentConfig(res.data);
      setSuccess(`Torneo activo: ${opt.label}`);
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Error al actualizar el torneo activo");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este fixture?")) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      fetchFixtures();
      fetchActiveFixtures();
      fetchCategoryAll(filters.category);
      setSuccess("Fixture eliminado correctamente");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Error al eliminar el fixture");
    }
  };

  const handleEdit   = (fixture) => { setEditingFixture(fixture); setShowModal(true); };
  const handleCreate = ()         => { setEditingFixture(null);    setShowModal(true); };

  const handleSubmitFixture = async (data) => {
    try {
      setError(null);
      let imageUrl = data.image;

      if (data.imageFile) {
        const formData = new FormData();
        formData.append("file", data.imageFile);
        formData.append("upload_preset", "suelApp");
        formData.append("folder", "fixtures");
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/tablonimus/image/upload",
          formData
        );
        imageUrl = response.data.secure_url;
      }

      const payload = {
        ...data,
        number: parseInt(data.number),
        matchweek: data.stage === "temporada" ? parseInt(data.matchweek) : undefined,
        playDates: { from: data.playDates?.from || null, to: data.playDates?.to || null },
        image: imageUrl,
      };

      if (editingFixture) {
        await axios.put(`${BASE_URL}/${editingFixture._id}`, payload);
        setSuccess("Fixture actualizado correctamente");
      } else {
        await axios.post(BASE_URL, payload);
        setSuccess("Fixture creado correctamente");
      }

      fetchFixtures();
      fetchActiveFixtures();
      fetchCategoryAll(filters.category);
      setShowModal(false);
      setEditingFixture(null);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message || "Error al procesar la solicitud");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl text-white font-bold mb-6">Gestión de Fixtures</h1>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
          <FaTimesCircle className="flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 text-sm">
          <FaCheckCircle className="flex-shrink-0" /> {success}
        </div>
      )}

      {/* ── Torneo Activo (solo lectura) ── */}
      {activeTournamentConfig && (
        <div className="bg-gray-800 rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">
            Torneo Activo
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-orange-500 text-white border border-orange-500 shadow-lg shadow-orange-500/25 w-fit">
            {activeTournamentConfig.tournament} {activeTournamentConfig.season}
            <span className="flex items-center gap-1 bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
              Activo
            </span>
          </div>
        </div>
      )}

      {/* ── Header: fixtures activos + botón Nuevo ── */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-start">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest">
            Fechas activas ({activeFixtures.length})
          </p>
          <button
            onClick={handleCreate}
            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2 rounded-xl transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <FaPlus className="text-sm" /> Nuevo Fixture
          </button>
        </div>
        {activeFixtures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeFixtures.map((af) => (
              <div key={af._id} className="bg-gray-800 rounded-2xl p-4 flex items-center gap-4">
                {af.image && (
                  <img
                    src={af.image}
                    alt="Activo"
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm truncate">
                    Fecha {af.number} — {CATEGORY_LABELS[af.category] ?? af.category}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {af.tournament} · {af.season}
                  </p>
                  <span className="inline-block mt-1.5 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Activo
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hay fechas activas</p>
        )}
      </div>

      {/* ── Filtros ── */}
      <div className="bg-gray-800 rounded-2xl p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none text-sm"
          >
            <option value="FSP Masculino">FSP Masculino</option>
            <option value="FSP Femenino">FSP Femenino</option>
            <option value="DH">DH</option>
            <option value="TI">TI</option>
            <option value="TN">TN</option>
            <option value="CM">CM</option>
          </select>
          <select
            value={filters.season}
            onChange={(e) => setFilters({ ...filters, season: e.target.value })}
            className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none text-sm"
          >
            <option value="">Todas las temporadas</option>
            {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filters.tournament}
            onChange={(e) => setFilters({ ...filters, tournament: e.target.value })}
            className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none text-sm"
          >
            <option value="">Todos los torneos</option>
            {tournaments.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* ── Tabla ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
            <p className="text-gray-400">Cargando fixtures...</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-white text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left p-3">#</th>
                  <th className="text-left p-3">Categoría</th>
                  <th className="text-left p-3">Temporada</th>
                  <th className="text-left p-3">Torneo</th>
                  <th className="text-left p-3">Etapa</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {fixtures.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-500">
                      No hay fixtures para este filtro
                    </td>
                  </tr>
                ) : fixtures.map((f) => (
                  <tr
                    key={f._id}
                    className="border-b border-gray-700 hover:bg-gray-700/40 transition-colors"
                  >
                    <td className="p-3 font-semibold">{f.number}</td>
                    <td className="p-3">{CATEGORY_LABELS[f.category] ?? f.category}</td>
                    <td className="p-3 text-gray-400">{f.season}</td>
                    <td className="p-3 text-gray-400">{f.tournament}</td>
                    <td className="p-3 capitalize text-gray-400">{f.stage}</td>
                    <td className="p-3">
                      {f.is_Active ? (
                        <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          Activo
                        </span>
                      ) : (
                        <span className="bg-gray-700 border border-gray-600 text-gray-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {!f.is_Active && (
                          <button
                            onClick={() => handleSetActive(f._id)}
                            className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                          >
                            Activar
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(f)}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(f._id)}
                          className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-gray-700">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-4 py-1.5 rounded-lg bg-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-400">
                Página{" "}
                <span className="font-semibold text-white">{page}</span>
                {" "}de{" "}
                <span className="font-semibold text-white">{totalPages}</span>
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="px-4 py-1.5 rounded-lg bg-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      )}

      <FixtureForm
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitFixture}
        initialData={editingFixture}
      />
    </div>
  );
};

export default FixturesManager;
