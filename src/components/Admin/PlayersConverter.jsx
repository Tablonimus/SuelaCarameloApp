import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import silueta from "../../assets/images/silueta.jpg";

const defaultPlayerInput = {
  name: "",
  number: "",
  alias: "",
  birthdate: "",
  current_club_name: "",
  category: "",
  club_arrival: "",
  position: "",
  instagram: "",
  image: "",
};

export default function PlayersConverter() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [meta, setMeta] = useState({ totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 10 });

  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerInput, setPlayerInput] = useState(defaultPlayerInput);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (searchTerm) params.searchTerm = searchTerm;
      if (selectedTeam) params.team = selectedTeam;
      const res = await axios.get(`${BASE_URL}/players`, { params });
      setPlayers(res.data.data);
      setMeta(res.data.meta)
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, selectedTeam]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  useEffect(() => {
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedTeam, limit]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/teams`);
        setTeams(res.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchTeams();
  }, []);

  const handleImageUpload = useCallback(async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "suelApp");
    data.append("folder", "suelApp/players");

    try {
      setLoadingImage(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/tablonimus/image/upload",
        data
      );
      setPlayerInput((prev) => ({
        ...prev,
        image: res.data.secure_url,
      }));
    } catch (error) {
      console.log("Error uploading image:", error);
      alert("Error al subir la imagen");
    } finally {
      setLoadingImage(false);
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setPlayerInput((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (playerInput.name) {
      setLoading(true);
      const submitData = async () => {
        try {
          if (isEditing && currentPlayer) {
            await axios.put(`${BASE_URL}/players/${currentPlayer.id || currentPlayer._id}`, playerInput);
          } else {
            await axios.post(`${BASE_URL}/players`, playerInput);
          }
          fetchPlayers();
          setModalOpen(false);
          setIsEditing(false);
          setCurrentPlayer(null);
          setPlayerInput(defaultPlayerInput);
        } catch (error) {
          console.error("Error submitting player:", error);
          alert("Error al guardar el jugador");
        } finally {
          setLoading(false);
        }
      };
      submitData();
    } else {
      alert("El nombre es obligatorio");
    }
  }

  function handleEdit(player) {
    setIsEditing(true);
    setCurrentPlayer(player);
    setPlayerInput({ ...player });
    setModalOpen(true);
  }

  function handleDelete(player) {
    const id = player.id || player._id;
    if (window.confirm("¿Estás seguro de eliminar este jugador?")) {
      const deleteData = async () => {
        try {
          await axios.delete(`${BASE_URL}/players/${id}`);
          fetchPlayers();
        } catch (error) {
          console.error("Error deleting player:", error);
          alert("Error al eliminar el jugador");
        }
      };
      deleteData();
    }
  }

  function openCreateModal() {
    setIsEditing(false);
    setCurrentPlayer(null);
    setPlayerInput(defaultPlayerInput);
    setModalOpen(true);
  }

  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando jugadores...</p>
        </div>
      </div>
    );
  }

  const teamNames = teams ? teams.map(team => team.name) : [];

  return (
    <div className="p-4">
      <h1 className="text-3xl text-white font-bold mb-6 text-center">Gestión de Jugadores</h1>

      <button
        onClick={openCreateModal}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700"
      >
        Crear Jugador
      </button>

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg p-2 text-black flex-1"
          />
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="rounded-lg p-2 text-black"
          >
            <option value="">Todos los equipos</option>
            {teams.map((team) => (
              <option key={team._id || team.id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-lg p-2 text-black"
          >
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <h2 className="text-2xl text-white font-bold mb-4">Jugadores Existentes</h2>
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left p-2">Foto</th>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Número</th>
              <th className="text-left p-2">Apodo</th>
              <th className="text-left p-2">Fecha Nacimiento</th>
              <th className="text-left p-2">Equipo</th>
              <th className="text-left p-2">Categoría</th>
              <th className="text-left p-2">Posición</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {players && players.length > 0 ? (
              players.map((player) => (
                <tr key={player.id || player._id} className="border-b border-gray-600">
                  <td className="p-2">
                    <img src={!player.image || player.image === '-' ? silueta : player.image} alt={player.name} className="w-12 h-12 object-contain rounded-full" />
                  </td>
                  <td className="p-2">{player.name}</td>
                  <td className="p-2">{player.number}</td>
                  <td className="p-2">{player.alias}</td>
                  <td className="p-2">{player.birthdate}</td>
                  <td className="p-2">{player.current_club_name}</td>
                  <td className="p-2">{player.category}</td>
                  <td className="p-2">{player.position}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(player)}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(player)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-4">No hay jugadores</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-white">
          Mostrando {players?.length} de {meta?.totalItems} jugadores
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1 || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-500 hover:bg-blue-700"
          >
            Anterior
          </button>
          <span className="text-white self-center">
            Página {meta.currentPage} de {meta.totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
            disabled={page >= meta.totalPages || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-500 hover:bg-blue-700"
          >
            Siguiente
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-700 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl text-white font-bold mb-4">
              {isEditing ? "Editar Jugador" : "Crear Jugador"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col">
                <label className="text-white font-semibold">Nombre *</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="name"
                  value={playerInput.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Foto</label>
                <input
                  type="file"
                  accept=".jpg, .png, .jpeg, .webp"
                  onChange={handleImageUpload}
                  className="rounded-lg p-2 bg-amber-600 text-white"
                  disabled={loading}
                />
                {loadingImage ? (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                    <span className="text-orange-400">Subiendo imagen...</span>
                  </div>
                ) : playerInput.image ? (
                  <div className="relative mt-2">
                    <img
                      src={playerInput.image}
                      alt="Player photo"
                      className="w-24 h-24 object-contain rounded-full"
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Número</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="number"
                  value={playerInput.number}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Apodo</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="alias"
                  value={playerInput.alias}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Fecha de Nacimiento</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="birthdate"
                  value={playerInput.birthdate}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Equipo</label>
                <select
                  className="rounded-lg p-2 text-black"
                  name="current_club_name"
                  value={playerInput.current_club_name}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Seleccione equipo</option>
                  {teamNames.map((name, index) => (
                    <option key={index} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Categoría</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="category"
                  value={playerInput.category}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Llegada al Club</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="club_arrival"
                  value={playerInput.club_arrival}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Posición</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="position"
                  value={playerInput.position}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Instagram</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="instagram"
                  value={playerInput.instagram}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`${
                    loading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white font-bold rounded-lg p-3 mt-2 flex-1 flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {isEditing ? "Guardando..." : "Creando..."}
                    </>
                  ) : (
                    isEditing ? "Guardar Cambios" : "Crear Jugador"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={loading}
                  className="bg-gray-500 text-white font-bold rounded-lg p-3 mt-2 hover:bg-gray-600 flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
