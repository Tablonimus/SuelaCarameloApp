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
} from "flowbite-react";
import { FaEdit, FaTrash, FaFutbol, FaSave, FaPlus } from "react-icons/fa";

const LiveResultsUpdater = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
    const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
  // const BASE_URL = "http://localhost:3000/sc";

  // Estados para nuevo partido
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
  });

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
      setLoading(false);
    } catch (err) {
      setError("Error al cargar los datos");
      setLoading(false);
    }
  };

  // Fetch matches from API
  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar partidos
  const filteredMatches = matches.filter((match) => {
    const categoryMatch =
      filterCategory === "all" || match.category === filterCategory;
    const statusMatch = filterStatus === "all" || match.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  // Manejar cambio en el marcador
  const handleScoreChange = (matchId, team, value) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) =>
        match._id === matchId
          ? {
              ...match,
              score: {
                ...match.score,
                [team]: parseInt(value) || 0,
              },
            }
          : match
      )
    );
  };

  // Guardar cambios en un partido
  const saveMatchChanges = async (matchId) => {
    try {
      const matchToUpdate = matches.find((m) => m._id === matchId);
      const response = await fetch(BASE_URL + `/matches/${matchId}/score`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          localScore: matchToUpdate.score.local,
          visitorScore: matchToUpdate.score.visitor,
          status: matchToUpdate.status,
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar");

      const res = await response.json();
      console.log(res);

      setMatches((prevMatches) =>
        prevMatches.map((m) => (m._id === matchId ? res.match : m))
      );
    } catch (err) {
      setError("Error al guardar los cambios");
    }
  };

  // Eliminar partido
  const deleteMatch = async (matchId) => {
    if (!window.confirm("¿Estás seguro de eliminar este partido?")) return;

    try {
      const response = await fetch(BASE_URL + `/matches/${matchId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar");

      setMatches((prevMatches) => prevMatches.filter((m) => m._id !== matchId));
    } catch (err) {
      setError("Error al eliminar el partido");
    }
  };

  // Crear nuevo partido
  const handleCreateMatch = async () => {
    try {
      const response = await fetch(BASE_URL + "/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMatch),
      });

      if (!response.ok) throw new Error("Error al crear");

      const createdMatch = await response.json();

      console.log(createdMatch);
      
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
      });
    } catch (err) {
      setError("Error al crear el partido");
    }
  };

  if (loading) return <Spinner size="xl" className="mx-auto my-8" />;
  if (error) return <Alert color="failure">{error}</Alert>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Partidos</h2>
        <Button onClick={() => setShowModal(true)}>
          <FaPlus className="mr-2" /> Nuevo Partido
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="category-filter" value="Filtrar por categoría" />
          <Select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="status-filter" value="Filtrar por estado" />
          <Select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="playing">En juego</option>
            <option value="finished">Finalizado</option>
            <option value="postponed">Aplazado</option>
            <option value="canceled">Cancelado</option>
          </Select>
        </div>
      </div>

      {/* Tabla de partidos */}
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Fecha/Hora</Table.HeadCell>
            <Table.HeadCell>Local</Table.HeadCell>
            <Table.HeadCell>Visitante</Table.HeadCell>
            <Table.HeadCell>Marcador</Table.HeadCell>
            <Table.HeadCell>Estado</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredMatches.map((match) => (
              <Table.Row
                key={match._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>
                  {new Date(match.date).toLocaleDateString()} {match.time}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center">
                    <img
                      src={match?.local?.logo}
                      alt={match?.local?.name}
                      className="w-6 h-6 mr-2"
                    />
                    {match?.local?.name}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center">
                    <img
                      src={match?.visitor?.logo}
                      alt={match?.visitor?.name}
                      className="w-6 h-6 mr-2"
                    />
                    {match?.visitor?.name}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center space-x-2">
                    <TextInput
                      type="number"
                      min="0"
                      className="w-16 text-center"
                      value={match?.score?.local}
                      onChange={(e) =>
                        handleScoreChange(match?._id, "local", e.target.value)
                      }
                    />
                    <span> - </span>
                    <TextInput
                      type="number"
                      min="0"
                      className="w-16 text-center"
                      value={match?.score?.visitor}
                      onChange={(e) =>
                        handleScoreChange(match?._id, "visitor", e.target.value)
                      }
                    />
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Select
                    value={match.status}
                    onChange={(e) => {
                      setMatches((prevMatches) =>
                        prevMatches.map((m) =>
                          m._id === match._id
                            ? { ...m, status: e.target.value }
                            : m
                        )
                      );
                    }}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="playing">En juego</option>
                    <option value="finished">Finalizado</option>
                    <option value="postponed">Aplazado</option>
                    <option value="canceled">Cancelado</option>
                  </Select>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex space-x-2">
                    <Button
                      size="xs"
                      color="success"
                      onClick={() => saveMatchChanges(match._id)}
                    >
                      <FaSave className="mr-1" /> Guardar
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

      {/* Modal para crear nuevo partido */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Crear Nuevo Partido</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="place" value="Lugar" />
              <TextInput
                id="place"
                value={newMatch.place}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, place: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" value="Fecha" />
                <TextInput
                  id="date"
                  type="date"
                  value={newMatch.date}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="time" value="Hora" />
                <TextInput
                  id="time"
                  type="time"
                  value={newMatch.time}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, time: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="local" value="Equipo Local" />
                <Select
                  id="local"
                  value={newMatch.local}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, local: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar</option>
                  {teams.map((team, index) => (
                    <option key={index} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="visitor" value="Equipo Visitante" />
                <Select
                  id="visitor"
                  value={newMatch.visitor}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, visitor: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" value="Categoría" />
                <Select
                  id="category"
                  value={newMatch.category}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, category: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="referee" value="Árbitro" />
                <TextInput
                  id="referee"
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
          <Button onClick={handleCreateMatch}>Crear Partido</Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LiveResultsUpdater;
