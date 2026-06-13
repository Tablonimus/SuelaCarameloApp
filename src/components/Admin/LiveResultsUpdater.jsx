// Versión completa y adaptada a tus requerimientos
import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Label,
  TextInput,
  Select,
  Alert,
  Spinner,
} from "flowbite-react";
import {
  FaEdit,
  FaTrash,
  FaFutbol,
  FaSave,
  FaPlus,
  FaCheckCircle,
  FaExclamationCircle,
  FaChevronLeft,
} from "react-icons/fa";

const statusLabels = {
  pending: "Pendiente",
  first_half: "1er Tiempo",
  halftime: "Descanso",
  second_half: "2do Tiempo",
  extra_time: "T. Extra",
  penalties: "Penales",
  finished: "Finalizado",
  suspended: "Suspendido",
  postponed: "Aplazado",
  canceled: "Cancelado",
};

const LIMIT = 10;

const ACTIVE_STATUSES = ["first_half", "halftime", "second_half", "extra_time", "penalties"];

function isRecentMatch(match) {
  if (ACTIVE_STATUSES.includes(match.status)) return true;
  const matchDate = new Date(match.date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return matchDate >= yesterday;
}

const statusColors = {
  pending:      "bg-zinc-700 text-zinc-300",
  first_half:   "bg-green-600/30 text-green-400",
  halftime:     "bg-yellow-600/30 text-yellow-400",
  second_half:  "bg-green-600/30 text-green-400",
  extra_time:   "bg-blue-600/30 text-blue-400",
  penalties:    "bg-purple-600/30 text-purple-400",
  finished:     "bg-zinc-700 text-zinc-400",
  suspended:    "bg-red-600/30 text-red-400",
  postponed:    "bg-orange-600/30 text-orange-400",
  canceled:     "bg-red-900/40 text-red-500",
};

const LiveResultsUpdater = ({ userRole = "reporter", currentUser = null }) => {
  const isAdmin = userRole === "admin";

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [localOpen, setLocalOpen] = useState(false);
  const [visitorSearch, setVisitorSearch] = useState("");
  const [visitorOpen, setVisitorOpen] = useState(false);
  const localRef = useRef(null);
  const visitorRef = useRef(null);
  const [newMatch, setNewMatch] = useState({
    place: "",
    date: "",
    time: "",
    local: "",
    visitor: "",
    category: "",
    referee: "",
    status: "pending",
    score: { local: 0, visitor: 0 },
    penaltyScore: { local: 0, visitor: 0 },
    assignedTo: "",
  });
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [liveEdit, setLiveEdit] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
  // const BASE_URL = "http://localhost:3000/sc";

  const fetchData = async () => {
    try {
      setLoading(true);
      const matchesUrl = isAdmin
        ? `${BASE_URL}/matches?page=${page}&limit=${LIMIT}`
        : `${BASE_URL}/matches?assignedTo=${currentUser?.username ?? ""}`;

      const requests = [
        fetch(matchesUrl).then((res) => res.json()),
        fetch(BASE_URL + "/teams").then((res) => res.json()),
      ];
      if (isAdmin) {
        requests.push(fetch(BASE_URL + "/auth/users").then((res) => res.json()));
      }

      const results = await Promise.all(requests);
      const matchesPayload = results[0];
      if (matchesPayload?.data) {
        setMatches(matchesPayload.data);
        setTotalPages(matchesPayload.meta?.totalPages ?? 1);
      } else {
        setMatches(Array.isArray(matchesPayload) ? matchesPayload : []);
      }
      setTeams(results[1]);
      setCategories(["A1", "FEM"]);
      if (isAdmin) setUsers(results[2]);
    } catch {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (localRef.current && !localRef.current.contains(e.target)) setLocalOpen(false);
      if (visitorRef.current && !visitorRef.current.contains(e.target)) setVisitorOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMatches = matches.filter((match) => {
    const categoryMatch =
      filterCategory === "all" || match.category === filterCategory;
    const statusMatch =
      filterStatus === "all" ||
      (filterStatus === "playing"
        ? ["first_half", "second_half", "extra_time", "penalties"].includes(
            match.status
          )
        : match.status === filterStatus);
    return categoryMatch && statusMatch;
  });

  // Vista de cards: solo partidos activos o de ayer en adelante
  const cardMatches = isMobile || !isAdmin
    ? matches.filter(isRecentMatch)
    : [];

  const handleScoreChange = (id, team, value, penalty = false) => {
    setMatches((prev) =>
      prev.map((m) =>
        m._id === id
          ? {
              ...m,
              [penalty ? "penaltyScore" : "score"]: {
                ...(penalty ? m.penaltyScore : m.score),
                [team]: parseInt(value) || 0,
              },
            }
          : m
      )
    );
  };

  const saveMatchChanges = async (matchId) => {
    try {
      const matchToUpdate = matches.find((m) => m._id === matchId);
      const response = await fetch(BASE_URL + `/matches/${matchId}/score`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          localScore: matchToUpdate.score.local,
          visitorScore: matchToUpdate.score.visitor,
          status: matchToUpdate.status,
          penaltyScore: matchToUpdate.penaltyScore,
        }),
      });
      if (!response.ok) throw new Error();
      const res = await response.json();
      setMatches((prev) =>
        prev.map((m) => (m._id === matchId ? res.match : m))
      );
      setSuccess("Partido actualizado exitosamente.");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Error al guardar los cambios");
      setTimeout(() => setError(null), 4000);
    }
  };

  const deleteMatch = async (matchId) => {
    if (!window.confirm("¿Eliminar este partido?")) return;
    try {
      const res = await fetch(BASE_URL + `/matches/${matchId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setMatches((prev) => prev.filter((m) => m._id !== matchId));
      setSuccess("Partido eliminado correctamente.");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Error al eliminar el partido");
      setTimeout(() => setError(null), 4000);
    }
  };

  function openEdit(match) {
    setLiveEdit({
      match,
      score: { ...match.score },
      penaltyScore: { ...(match.penaltyScore ?? { local: 0, visitor: 0 }) },
      status: match.status,
    });
  }

  function closeEdit() {
    setLiveEdit(null);
  }

  async function saveEdit() {
    try {
      const response = await fetch(BASE_URL + `/matches/${liveEdit.match._id}/score`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          localScore: liveEdit.score.local,
          visitorScore: liveEdit.score.visitor,
          status: liveEdit.status,
          penaltyScore: liveEdit.penaltyScore,
        }),
      });
      if (!response.ok) throw new Error();
      const res = await response.json();
      setMatches((prev) => prev.map((m) => (m._id === liveEdit.match._id ? res.match : m)));
      setSuccess("Partido guardado correctamente.");
      setTimeout(() => setSuccess(null), 4000);
      setLiveEdit(null);
    } catch {
      setError("Error al guardar los cambios");
      setTimeout(() => setError(null), 4000);
    }
  }

  const handleCreateMatch = async (e) => {
    e?.preventDefault();
    if (!newMatch.local || !newMatch.visitor || !newMatch.category) {
      setError("Completá local, visitante y categoría.");
      setTimeout(() => setError(null), 4000);
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(BASE_URL + "/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMatch),
      });
      if (!res.ok) throw new Error();
      const createdMatch = await res.json();
      setMatches((prev) => [createdMatch.match, ...prev]);
      setShowModal(false);
      setLocalSearch(""); setVisitorSearch("");
      setNewMatch({
        place: "", date: "", time: "", local: "", visitor: "",
        category: "", referee: "", status: "pending",
        score: { local: 0, visitor: 0 },
        penaltyScore: { local: 0, visitor: 0 },
        assignedTo: "",
      });
      setSuccess("Partido creado exitosamente.");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Error al crear el partido");
      setTimeout(() => setError(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">

      {/* ── Fullscreen editor — reporter + admin mobile ── */}
      {(!isAdmin || isMobile) && liveEdit && (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-zinc-900 flex-shrink-0">
            <button
              onClick={closeEdit}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <FaChevronLeft className="text-lg" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">
                {liveEdit.match.category}
                {liveEdit.match.date && ` · ${new Date(liveEdit.match.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}`}
                {liveEdit.match.time && ` · ${liveEdit.match.time}`}
              </p>
              {liveEdit.match.place && (
                <p className="text-xs text-zinc-400 truncate">{liveEdit.match.place}</p>
              )}
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${statusColors[liveEdit.status] ?? "bg-zinc-700 text-zinc-300"}`}>
              {statusLabels[liveEdit.status]}
            </span>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center px-4 py-8 gap-8">

            {/* Scoreboard */}
            <div className="w-full flex items-start justify-between gap-2">

              {/* Local */}
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {liveEdit.match.local?.logo
                    ? <img src={liveEdit.match.local.logo} className="w-full h-full object-cover" />
                    : <FaFutbol className="text-zinc-600 text-2xl" />}
                </div>
                <p className="text-sm font-bold text-white text-center leading-tight">{liveEdit.match.local?.name}</p>
                <span className="text-8xl font-black text-white tabular-nums leading-none">{liveEdit.score.local}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLiveEdit((p) => ({ ...p, score: { ...p.score, local: Math.max(0, p.score.local - 1) } }))}
                    className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/10 text-2xl font-bold text-zinc-300 hover:bg-zinc-700 active:scale-95 transition-all select-none"
                  >−</button>
                  <button
                    onClick={() => setLiveEdit((p) => ({ ...p, score: { ...p.score, local: p.score.local + 1 } }))}
                    className="w-14 h-14 rounded-2xl bg-orange-500 text-2xl font-bold text-white hover:bg-orange-400 active:scale-95 transition-all shadow-lg shadow-orange-500/30 select-none"
                  >+</button>
                </div>
              </div>

              <div className="pt-20 text-zinc-700 font-black text-3xl flex-shrink-0">-</div>

              {/* Visitor */}
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {liveEdit.match.visitor?.logo
                    ? <img src={liveEdit.match.visitor.logo} className="w-full h-full object-cover" />
                    : <FaFutbol className="text-zinc-600 text-2xl" />}
                </div>
                <p className="text-sm font-bold text-white text-center leading-tight">{liveEdit.match.visitor?.name}</p>
                <span className="text-8xl font-black text-white tabular-nums leading-none">{liveEdit.score.visitor}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLiveEdit((p) => ({ ...p, score: { ...p.score, visitor: Math.max(0, p.score.visitor - 1) } }))}
                    className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/10 text-2xl font-bold text-zinc-300 hover:bg-zinc-700 active:scale-95 transition-all select-none"
                  >−</button>
                  <button
                    onClick={() => setLiveEdit((p) => ({ ...p, score: { ...p.score, visitor: p.score.visitor + 1 } }))}
                    className="w-14 h-14 rounded-2xl bg-orange-500 text-2xl font-bold text-white hover:bg-orange-400 active:scale-95 transition-all shadow-lg shadow-orange-500/30 select-none"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Penalty scores — only when status=penalties */}
            {liveEdit.status === "penalties" && (
              <div className="w-full bg-zinc-900 rounded-2xl p-4 border border-white/10">
                <p className="text-xs text-zinc-400 text-center mb-4 uppercase tracking-widest">Penales</p>
                <div className="flex items-center justify-around">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setLiveEdit((p) => ({ ...p, penaltyScore: { ...p.penaltyScore, local: Math.max(0, p.penaltyScore.local - 1) } }))}
                      className="w-11 h-11 rounded-xl bg-zinc-800 text-white text-xl font-bold hover:bg-zinc-700 active:scale-95 transition-all select-none"
                    >−</button>
                    <span className="text-4xl font-black text-white w-10 text-center tabular-nums">{liveEdit.penaltyScore.local}</span>
                    <button
                      onClick={() => setLiveEdit((p) => ({ ...p, penaltyScore: { ...p.penaltyScore, local: p.penaltyScore.local + 1 } }))}
                      className="w-11 h-11 rounded-xl bg-orange-500 text-white text-xl font-bold hover:bg-orange-400 active:scale-95 transition-all select-none"
                    >+</button>
                  </div>
                  <span className="text-zinc-600 font-black text-xl">—</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setLiveEdit((p) => ({ ...p, penaltyScore: { ...p.penaltyScore, visitor: Math.max(0, p.penaltyScore.visitor - 1) } }))}
                      className="w-11 h-11 rounded-xl bg-zinc-800 text-white text-xl font-bold hover:bg-zinc-700 active:scale-95 transition-all select-none"
                    >−</button>
                    <span className="text-4xl font-black text-white w-10 text-center tabular-nums">{liveEdit.penaltyScore.visitor}</span>
                    <button
                      onClick={() => setLiveEdit((p) => ({ ...p, penaltyScore: { ...p.penaltyScore, visitor: p.penaltyScore.visitor + 1 } }))}
                      className="w-11 h-11 rounded-xl bg-orange-500 text-white text-xl font-bold hover:bg-orange-400 active:scale-95 transition-all select-none"
                    >+</button>
                  </div>
                </div>
              </div>
            )}

            {/* Status chips */}
            <div className="w-full">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3 text-center">Estado del partido</p>
              <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setLiveEdit((p) => ({ ...p, status: value }))}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      liveEdit.status === value
                        ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30"
                        : "bg-zinc-800 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="px-4 pb-8 pt-3 border-t border-white/10 bg-zinc-950 flex-shrink-0">
            {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}
            <button
              onClick={saveEdit}
              className="w-full py-4 rounded-2xl bg-orange-500 text-white font-black text-lg hover:bg-orange-400 active:scale-[0.98] transition-all shadow-xl shadow-orange-500/30"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      )}

      {/* ── Main panel ── */}
      <div className="p-4">
        {error && !liveEdit && (
          <Alert color="failure" icon={FaExclamationCircle} className="mb-4">{error}</Alert>
        )}
        {success && (
          <Alert color="success" icon={FaCheckCircle} className="mb-4">{success}</Alert>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Gestión de Partidos</h2>
          {isAdmin && (
            <Button onClick={() => setShowModal(true)}>
              <FaPlus className="mr-2" />
              Nuevo
            </Button>
          )}
        </div>

        {/* Admin desktop: filtros + tabla paginada */}
        {isAdmin && !isMobile && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="category-filter" value="Categoría" />
                <Select id="category-filter" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="all">Todas</option>
                  <option value="A1">FSP Masculino</option>
                  <option value="FEM">FSP Femenino</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="status-filter" value="Estado" />
                <Select id="status-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">Todos</option>
                  <option value="pending">Pendiente</option>
                  <option value="playing">En juego</option>
                  <option value="finished">Finalizado</option>
                  <option value="suspended">Suspendido</option>
                  <option value="postponed">Aplazado</option>
                  <option value="canceled">Cancelado</option>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <Table.Head>
                  <Table.HeadCell>Fecha</Table.HeadCell>
                  <Table.HeadCell>Local</Table.HeadCell>
                  <Table.HeadCell>Visitante</Table.HeadCell>
                  <Table.HeadCell>Marcador</Table.HeadCell>
                  <Table.HeadCell>Estado</Table.HeadCell>
                  <Table.HeadCell>Acciones</Table.HeadCell>
                </Table.Head>
                <Table.Body className="border">
                  {filteredMatches.map((match) => (
                    <Table.Row className="border" key={match._id}>
                      <Table.Cell className="text-white">
                        {new Date(match.date).toLocaleDateString()} {match.time}
                      </Table.Cell>
                      <Table.Cell className="text-white">{match?.local?.name}</Table.Cell>
                      <Table.Cell className="text-white">{match?.visitor?.name}</Table.Cell>
                      <Table.Cell className="text-white">
                        <div className="flex items-center gap-2">
                          <TextInput type="number" className="w-14 text-center" value={match.score.local}
                            onChange={(e) => handleScoreChange(match._id, "local", e.target.value)} />
                          <span>-</span>
                          <TextInput type="number" className="w-14 text-center" value={match.score.visitor}
                            onChange={(e) => handleScoreChange(match._id, "visitor", e.target.value)} />
                        </div>
                        {(match.status === "penalties" || match.penaltyScore?.local > 0 || match.penaltyScore?.visitor > 0) && (
                          <div className="mt-1 text-xs text-white">
                            Penales:
                            <TextInput type="number" className="w-12 mx-1 inline-block" value={match.penaltyScore?.local || 0}
                              onChange={(e) => handleScoreChange(match._id, "local", e.target.value, true)} />
                            -
                            <TextInput type="number" className="w-12 mx-1 inline-block" value={match.penaltyScore?.visitor || 0}
                              onChange={(e) => handleScoreChange(match._id, "visitor", e.target.value, true)} />
                          </div>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Select value={match.status} onChange={(e) => {
                          const val = e.target.value;
                          setMatches((prev) => prev.map((m) => m._id === match._id ? { ...m, status: val } : m));
                        }}>
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </Select>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-2">
                          <Button size="xs" color="success" onClick={() => saveMatchChanges(match._id)}>
                            <FaSave className="mr-1" />Guardar
                          </Button>
                          <Button size="xs" color="failure" onClick={() => deleteMatch(match._id)}>
                            <FaTrash className="mr-1" />
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Anterior
                </button>
                <span className="text-sm text-zinc-400">
                  Página <span className="font-semibold text-white">{page}</span> de <span className="font-semibold text-white">{totalPages}</span>
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}

        {/* Cards: reporter siempre + admin en mobile */}
        {(!isAdmin || isMobile) && (
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-16"><Spinner size="xl" /></div>
            ) : cardMatches.length === 0 ? (
              <div className="text-center py-16">
                <FaFutbol className="text-zinc-700 text-4xl mx-auto mb-3" />
                <p className="text-zinc-500">{isAdmin ? "No hay partidos recientes." : "No tenés partidos asignados."}</p>
              </div>
            ) : (
              cardMatches.map((match) => (
                <button
                  key={match._id}
                  onClick={() => openEdit(match)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 hover:border-orange-500/40 hover:bg-zinc-800/80 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    {/* Local */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {match.local?.logo
                          ? <img src={match.local.logo} className="w-full h-full object-cover" />
                          : <FaFutbol className="text-zinc-600 text-base" />}
                      </div>
                      <span className="font-bold text-white text-sm truncate">{match.local?.name}</span>
                    </div>

                    {/* Score + status */}
                    <div className="flex flex-col items-center flex-shrink-0 px-2">
                      <span className="text-2xl font-black text-white tabular-nums">
                        {match.score?.local ?? 0} - {match.score?.visitor ?? 0}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 font-medium ${statusColors[match.status] ?? "bg-zinc-700 text-zinc-300"}`}>
                        {statusLabels[match.status]}
                      </span>
                    </div>

                    {/* Visitor */}
                    <div className="flex items-center gap-2 flex-1 min-w-0 flex-row-reverse">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {match.visitor?.logo
                          ? <img src={match.visitor.logo} className="w-full h-full object-cover" />
                          : <FaFutbol className="text-zinc-600 text-base" />}
                      </div>
                      <span className="font-bold text-white text-sm truncate text-right">{match.visitor?.name}</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      {match.date && new Date(match.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                      {match.time && ` · ${match.time}`}
                      {match.place && ` · ${match.place}`}
                    </span>
                    <span className="text-xs text-orange-400 font-semibold flex items-center gap-1 group-hover:text-orange-300">
                      <FaEdit className="text-xs" /> Editar
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Modal nuevo partido — solo admin */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                <h2 className="text-xl text-white font-bold">Nuevo Partido</h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
                >×</button>
              </div>

              <form onSubmit={handleCreateMatch} className="p-6 flex flex-col gap-5">

                {/* Equipos */}
                <div>
                  <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Equipos</p>
                  <div className="grid grid-cols-2 gap-3">

                    {/* Local */}
                    <div className="flex flex-col gap-1 relative" ref={localRef}>
                      <label className="text-gray-300 text-sm font-medium">Local *</label>
                      <div
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-700 border cursor-text transition-colors ${localOpen ? "border-orange-500" : "border-gray-600"} ${submitting ? "opacity-50 pointer-events-none" : ""}`}
                        onClick={() => !submitting && setLocalOpen(true)}
                      >
                        {!localOpen && newMatch.local && (() => {
                          const t = teams.find(t => t._id === newMatch.local);
                          return t?.logo ? <img src={t.logo} alt="" className="w-5 h-5 object-contain flex-shrink-0" /> : null;
                        })()}
                        <input
                          type="text"
                          value={localOpen ? localSearch : (teams.find(t => t._id === newMatch.local)?.name ?? "")}
                          onChange={(e) => { setLocalSearch(e.target.value); setLocalOpen(true); }}
                          onFocus={() => { setLocalSearch(""); setLocalOpen(true); }}
                          placeholder="Buscar equipo..."
                          disabled={submitting}
                          className="flex-1 min-w-0 bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                        />
                        <span className="text-gray-400 text-xs flex-shrink-0">▾</span>
                      </div>
                      {localOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-xl shadow-2xl z-20 max-h-52 overflow-y-auto">
                          {(() => {
                            const filtered = teams.filter(t => t.name.toLowerCase().includes(localSearch.toLowerCase()));
                            return filtered.length === 0 ? (
                              <div className="px-4 py-3 text-gray-400 text-sm">Sin resultados</div>
                            ) : (
                              <>
                                {newMatch.local && (
                                  <button type="button" onClick={() => { setNewMatch(p => ({ ...p, local: "" })); setLocalOpen(false); setLocalSearch(""); }}
                                    className="w-full px-4 py-2 text-left text-xs text-gray-400 hover:bg-gray-600 border-b border-gray-600">
                                    Quitar selección
                                  </button>
                                )}
                                {filtered.map(team => (
                                  <button key={team._id} type="button"
                                    onClick={() => { setNewMatch(p => ({ ...p, local: team._id })); setLocalOpen(false); setLocalSearch(""); }}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-600 transition-colors ${newMatch.local === team._id ? "bg-gray-600" : ""}`}
                                  >
                                    {team.logo
                                      ? <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain rounded flex-shrink-0" />
                                      : <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-xs text-gray-300 flex-shrink-0">?</div>}
                                    <span className="text-white text-sm truncate">{team.name}</span>
                                    {newMatch.local === team._id && <span className="ml-auto text-orange-400 text-xs flex-shrink-0">✓</span>}
                                  </button>
                                ))}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Visitante */}
                    <div className="flex flex-col gap-1 relative" ref={visitorRef}>
                      <label className="text-gray-300 text-sm font-medium">Visitante *</label>
                      <div
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-700 border cursor-text transition-colors ${visitorOpen ? "border-orange-500" : "border-gray-600"} ${submitting ? "opacity-50 pointer-events-none" : ""}`}
                        onClick={() => !submitting && setVisitorOpen(true)}
                      >
                        {!visitorOpen && newMatch.visitor && (() => {
                          const t = teams.find(t => t._id === newMatch.visitor);
                          return t?.logo ? <img src={t.logo} alt="" className="w-5 h-5 object-contain flex-shrink-0" /> : null;
                        })()}
                        <input
                          type="text"
                          value={visitorOpen ? visitorSearch : (teams.find(t => t._id === newMatch.visitor)?.name ?? "")}
                          onChange={(e) => { setVisitorSearch(e.target.value); setVisitorOpen(true); }}
                          onFocus={() => { setVisitorSearch(""); setVisitorOpen(true); }}
                          placeholder="Buscar equipo..."
                          disabled={submitting}
                          className="flex-1 min-w-0 bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                        />
                        <span className="text-gray-400 text-xs flex-shrink-0">▾</span>
                      </div>
                      {visitorOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-xl shadow-2xl z-20 max-h-52 overflow-y-auto">
                          {(() => {
                            const filtered = teams.filter(t => t.name.toLowerCase().includes(visitorSearch.toLowerCase()));
                            return filtered.length === 0 ? (
                              <div className="px-4 py-3 text-gray-400 text-sm">Sin resultados</div>
                            ) : (
                              <>
                                {newMatch.visitor && (
                                  <button type="button" onClick={() => { setNewMatch(p => ({ ...p, visitor: "" })); setVisitorOpen(false); setVisitorSearch(""); }}
                                    className="w-full px-4 py-2 text-left text-xs text-gray-400 hover:bg-gray-600 border-b border-gray-600">
                                    Quitar selección
                                  </button>
                                )}
                                {filtered.map(team => (
                                  <button key={team._id} type="button"
                                    onClick={() => { setNewMatch(p => ({ ...p, visitor: team._id })); setVisitorOpen(false); setVisitorSearch(""); }}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-600 transition-colors ${newMatch.visitor === team._id ? "bg-gray-600" : ""}`}
                                  >
                                    {team.logo
                                      ? <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain rounded flex-shrink-0" />
                                      : <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-xs text-gray-300 flex-shrink-0">?</div>}
                                    <span className="text-white text-sm truncate">{team.name}</span>
                                    {newMatch.visitor === team._id && <span className="ml-auto text-orange-400 text-xs flex-shrink-0">✓</span>}
                                  </button>
                                ))}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Detalles del partido */}
                <div>
                  <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Detalles del partido</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-300 text-sm font-medium">Categoría *</label>
                      <select
                        className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                        value={newMatch.category}
                        onChange={(e) => setNewMatch({ ...newMatch, category: e.target.value })}
                        disabled={submitting}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="A1">FSP Masculino</option>
                        <option value="FEM">FSP Femenino</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-300 text-sm font-medium">Árbitro</label>
                      <input
                        className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                        type="text"
                        value={newMatch.referee}
                        onChange={(e) => setNewMatch({ ...newMatch, referee: e.target.value })}
                        disabled={submitting}
                        placeholder="Nombre del árbitro"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-300 text-sm font-medium">Fecha</label>
                      <input
                        className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                        type="date"
                        value={newMatch.date}
                        onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                        disabled={submitting}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-300 text-sm font-medium">Hora</label>
                      <input
                        className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                        type="time"
                        value={newMatch.time}
                        onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })}
                        disabled={submitting}
                      />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                      <label className="text-gray-300 text-sm font-medium">Lugar</label>
                      <input
                        className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                        type="text"
                        value={newMatch.place}
                        onChange={(e) => setNewMatch({ ...newMatch, place: e.target.value })}
                        disabled={submitting}
                        placeholder="Ej: Polideportivo Municipal"
                      />
                    </div>
                  </div>
                </div>

                {/* Asignación */}
                <div>
                  <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Asignación</p>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Asignar a</label>
                    <select
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                      value={newMatch.assignedTo}
                      onChange={(e) => setNewMatch({ ...newMatch, assignedTo: e.target.value })}
                      disabled={submitting}
                    >
                      <option value="">Sin asignar</option>
                      {users.map((u) => <option key={u._id} value={u.username}>{u.username} ({u.role})</option>)}
                    </select>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 flex items-center justify-center gap-2 font-bold rounded-xl py-3 transition-colors ${
                      submitting
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-400 text-white"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Creando...
                      </>
                    ) : "Crear partido"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    className="flex-1 font-bold rounded-xl py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveResultsUpdater;
