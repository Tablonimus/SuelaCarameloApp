// FixturesManager.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Alert,
  Spinner,
  Badge,
  Card,
  Label,
  Select,
} from "flowbite-react";
import FixtureForm from "./FixtureForm";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const FixturesManager = () => {
  const [fixtures, setFixtures] = useState([]);
  const [activeFixture, setActiveFixture] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFixture, setEditingFixture] = useState(null);
  const [filters, setFilters] = useState({
    category: "A1",
    season: "",
    tournament: "",
  });

  const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc/fixtures";

  const fetchFixtures = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.season) params.append("season", filters.season);
      if (filters.tournament) params.append("tournament", filters.tournament);

      const response = await axios.get(`${BASE_URL}?${params.toString()}`);
      setFixtures(response.data.fixtures);
      setActiveFixture(response.data.activeFixture);
      setSeasons(response.data.seasons);
      setTournaments(response.data.tournaments);
    } catch (err) {
      setError("Error al cargar los fixtures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, [filters]);

  const handleSetActive = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/${id}/active`);
      fetchFixtures();
      setSuccess("Fixture activado correctamente");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Error al activar el fixture");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este fixture?")) return;

    try {
      await axios.delete(`${BASE_URL}/${id}`);
      fetchFixtures();
      setSuccess("Fixture eliminado correctamente");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Error al eliminar el fixture");
    }
  };

  const handleEdit = (fixture) => {
    setEditingFixture(fixture);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingFixture(null);
    setShowModal(true);
  };

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
          "https://api.cloudinary.com/v1_1/tu-cloud-name/image/upload",
          formData
        );
        imageUrl = response.data.secure_url;
      }

      const payload = {
        ...data,
        number: parseInt(data.number),
        matchweek:
          data.stage === "temporada" ? parseInt(data.matchweek) : undefined,
        playDates: {
          from: data.playDates?.from || null,
          to: data.playDates?.to || null,
        },

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
      setShowModal(false);
      setEditingFixture(null);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message || "Error al procesar la solicitud");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Gestión de Fixtures</h1>

      {error && (
        <Alert color="failure" icon={FaTimesCircle} className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert color="success" icon={FaCheckCircle} className="mb-4">
          {success}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-800 p-4 rounded-lg">
        <div>
          <Label htmlFor="category" value="Categoría" />
          <Select
            id="category"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="A1">A1</option>
            <option value="F1">F1</option>
            <option value="DH">DH</option>
            <option value="TI">TI</option>
            <option value="TN">TN</option>
            <option value="CM">CM</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="season" value="Temporada" />
          <Select
            id="season"
            value={filters.season}
            onChange={(e) => setFilters({ ...filters, season: e.target.value })}
          >
            <option value="">Todas</option>
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="tournament" value="Torneo" />
          <Select
            id="tournament"
            value={filters.tournament}
            onChange={(e) =>
              setFilters({ ...filters, tournament: e.target.value })
            }
          >
            <option value="">Todos</option>
            {tournaments.map((tournament) => (
              <option key={tournament} value={tournament}>
                {tournament}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {activeFixture && (
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <img
              src={activeFixture.image}
              alt="Activo"
              className="w-24 rounded"
            />
            <div className="flex flex-col justify-center">
              <h3 className="font-bold text-lg">
                Fecha {activeFixture.number} - {activeFixture.category}
              </h3>
              <p>
                {activeFixture.tournament} - {activeFixture.season}
              </p>
              <Badge color="success" className="w-fit mt-2">
                Activo
              </Badge>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-end mb-4">
        <Button onClick={handleCreate}>
          <FaPlus className="mr-2" /> Nuevo Fixture
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>#</Table.HeadCell>
            <Table.HeadCell>Categoría</Table.HeadCell>
            <Table.HeadCell>Temporada</Table.HeadCell>
            <Table.HeadCell>Torneo</Table.HeadCell>
            <Table.HeadCell>Etapa</Table.HeadCell>
            <Table.HeadCell>Estado</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {fixtures.map((f) => (
              <Table.Row key={f._id}>
                <Table.Cell>{f.number}</Table.Cell>
                <Table.Cell>{f.category}</Table.Cell>
                <Table.Cell>{f.season}</Table.Cell>
                <Table.Cell>{f.tournament}</Table.Cell>
                <Table.Cell className="capitalize">{f.stage}</Table.Cell>
                <Table.Cell>
                  {f.is_Active ? (
                    <Badge color="success">Activo</Badge>
                  ) : (
                    <Badge color="gray">Inactivo</Badge>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    {!f.is_Active && (
                      <Button
                        size="xs"
                        color="success"
                        onClick={() => handleSetActive(f._id)}
                      >
                        Activar
                      </Button>
                    )}
                    <Button size="xs" onClick={() => handleEdit(f)}>
                      <FaEdit />
                    </Button>
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => handleDelete(f._id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
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
