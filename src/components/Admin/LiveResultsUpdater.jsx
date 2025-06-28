// Versión completa y adaptada a tus requerimientos
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Label,
  TextInput,
  Select,
  Alert,
  Spinner,
  Toast,
} from "flowbite-react";
import {
  FaEdit,
  FaTrash,
  FaFutbol,
  FaSave,
  FaPlus,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const statusLabels = {
  pending: "Pendiente",
  first_half: "1er Tiempo",
  halftime: "Descanso",
  second_half: "2do Tiempo",
  extra_time: "Tiempo Extra",
  penalties: "Penales",
  finished: "Finalizado",
  suspended: "Suspendido",
  postponed: "Aplazado",
  canceled: "Cancelado",
};

const LiveResultsUpdater = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
  });
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
  // const BASE_URL = "http://localhost:3000/sc";

  const fetchData = async () => {
    try {
      setLoading(true);
      const [matchesRes, categoriesRes, teamsRes] = await Promise.all([
        fetch(BASE_URL + "/matches").then((res) => res.json()),
        ["A1", "FEM"],
        fetch(BASE_URL + "/teams").then((res) => res.json()),
      ]);
      setMatches(matchesRes);
      setCategories(categoriesRes);
      setTeams(teamsRes);
    } catch {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  const handleCreateMatch = async () => {
    try {
      if (!newMatch.local || !newMatch.visitor || !newMatch.category) {
        setError("Debes completar todos los campos obligatorios.");
        setTimeout(() => setError(null), 4000);
        return;
      }
      const res = await fetch(BASE_URL + "/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMatch),
      });
      if (!res.ok) throw new Error();
      const createdMatch = await res.json();
      setMatches((prev) => [...prev, createdMatch.match]);
      setShowModal(false);
      setNewMatch({
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
      });
      setSuccess("Partido creado exitosamente.");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Error al crear el partido");
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div className="p-4">
      {error && (
        <Alert color="failure" icon={FaExclamationCircle} className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert color="success" icon={FaCheckCircle} className="mb-4">
          {success}
        </Alert>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Gestión de Partidos</h2>
        <Button onClick={() => setShowModal(true)}>
          <FaPlus className="mr-2" />
          Nuevo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="category-filter" value="Categoría" />
          <Select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Todas</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="status-filter" value="Estado" />
          <Select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
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
          <Table.Body>
            {filteredMatches.map((match) => (
              <Table.Row key={match._id}>
                <Table.Cell>
                  {new Date(match.date).toLocaleDateString()} {match.time}
                </Table.Cell>
                <Table.Cell>{match?.local?.name}</Table.Cell>
                <Table.Cell>{match?.visitor?.name}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <TextInput
                      type="number"
                      className="w-14 text-center"
                      value={match.score.local}
                      onChange={(e) =>
                        handleScoreChange(match._id, "local", e.target.value)
                      }
                    />
                    <span>-</span>
                    <TextInput
                      type="number"
                      className="w-14 text-center"
                      value={match.score.visitor}
                      onChange={(e) =>
                        handleScoreChange(match._id, "visitor", e.target.value)
                      }
                    />
                  </div>
                  {(match.status === "penalties" ||
                    match.penaltyScore?.local > 0 ||
                    match.penaltyScore?.visitor > 0) && (
                    <div className="mt-1 text-xs text-gray-600">
                      Penales:
                      <TextInput
                        type="number"
                        className="w-12 mx-1 inline-block"
                        value={match.penaltyScore?.local || 0}
                        onChange={(e) =>
                          handleScoreChange(
                            match._id,
                            "local",
                            e.target.value,
                            true
                          )
                        }
                      />
                      -
                      <TextInput
                        type="number"
                        className="w-12 mx-1 inline-block"
                        value={match.penaltyScore?.visitor || 0}
                        onChange={(e) =>
                          handleScoreChange(
                            match._id,
                            "visitor",
                            e.target.value,
                            true
                          )
                        }
                      />
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Select
                    value={match.status}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMatches((prev) =>
                        prev.map((m) =>
                          m._id === match._id ? { ...m, status: val } : m
                        )
                      );
                    }}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button
                      size="xs"
                      color="success"
                      onClick={() => saveMatchChanges(match._id)}
                    >
                      <FaSave className="mr-1" />
                      Guardar
                    </Button>
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => deleteMatch(match._id)}
                    >
                      <FaTrash className="mr-1" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Nuevo Partido</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label value="Lugar" />
              <TextInput
                value={newMatch.place}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, place: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label value="Fecha" />
                <TextInput
                  type="date"
                  value={newMatch.date}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label value="Hora" />
                <TextInput
                  type="time"
                  value={newMatch.time}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label value="Local" />
                <Select
                  value={newMatch.local}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, local: e.target.value })
                  }
                >
                  <option value="">Seleccionar equipo</option>

                  {teams.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label value="Visitante" />
                <Select
                  value={newMatch.visitor}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, visitor: e.target.value })
                  }
                >
                  <option value="">Seleccionar equipo</option>

                  {teams.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label value="Categoría" />
                <Select
                  value={newMatch.category}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, category: e.target.value })
                  }
                >
                  <option value={""}>Seleccionar Categoría</option>
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label value="Árbitro" />
                <TextInput
                  value={newMatch.referee}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, referee: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateMatch}>Crear</Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LiveResultsUpdater;
