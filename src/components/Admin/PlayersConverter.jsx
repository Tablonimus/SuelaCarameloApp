import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import silueta from "../../assets/images/silueta.jpg";
import { useToast } from "../../hooks/useToast";
import Toast from "../UI/Toast";

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
  const [previewUrl, setPreviewUrl] = useState(null);

  const [teamSearch, setTeamSearch] = useState("");
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const teamSearchRef = useRef(null);

  const { showToast, toast } = useToast();

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

  useEffect(() => {
    function handleClickOutside(e) {
      if (teamSearchRef.current && !teamSearchRef.current.contains(e.target)) {
        setTeamDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageUpload = useCallback(async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const blobUrl = URL.createObjectURL(files[0]);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return blobUrl;
    });

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
      showToast("Error al subir la imagen", "error");
      setPreviewUrl(null);
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
    if (!playerInput.name) {
      showToast("El nombre es obligatorio", "error");
      return;
    }
    setLoading(true);
    const submitData = async () => {
      try {
        if (isEditing && currentPlayer) {
          await axios.put(`${BASE_URL}/players/${currentPlayer.id || currentPlayer._id}`, playerInput);
          showToast("Jugador actualizado correctamente");
        } else {
          await axios.post(`${BASE_URL}/players`, playerInput);
          showToast("Jugador creado correctamente");
        }
        fetchPlayers();
        closeModal();
        setIsEditing(false);
        setCurrentPlayer(null);
        setPlayerInput(defaultPlayerInput);
      } catch (error) {
        console.error("Error submitting player:", error);
        showToast("Error al guardar el jugador", "error");
      } finally {
        setLoading(false);
      }
    };
    submitData();
  }

  function closeModal() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setTeamSearch("");
    setTeamDropdownOpen(false);
    setModalOpen(false);
  }

  function handleEdit(player) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setTeamSearch("");
    setTeamDropdownOpen(false);
    setIsEditing(true);
    setCurrentPlayer(player);
    setPlayerInput({ ...player });
    setModalOpen(true);
  }

  function handleDelete(player) {
    const id = player.id || player._id;
    if (window.confirm(`¿Eliminar a ${player.name}?`)) {
      const deleteData = async () => {
        try {
          await axios.delete(`${BASE_URL}/players/${id}`);
          fetchPlayers();
          showToast(`${player.name} eliminado`);
        } catch (error) {
          console.error("Error deleting player:", error);
          showToast("Error al eliminar el jugador", "error");
        }
      };
      deleteData();
    }
  }

  function openCreateModal() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setTeamSearch("");
    setTeamDropdownOpen(false);
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl text-white font-bold">
                {isEditing ? "Editar Jugador" : "Nuevo Jugador"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

              {/* Foto */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-28 h-28">
                  <img
                    src={previewUrl || playerInput.image || silueta}
                    alt="Foto jugador"
                    className={`w-28 h-28 rounded-full object-cover border-2 border-gray-600 ${loadingImage ? "opacity-50" : ""}`}
                  />
                  {loadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-orange-500"></div>
                    </div>
                  )}
                </div>
                <label className={`cursor-pointer text-sm font-medium px-4 py-2 rounded-lg transition-colors ${loading ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-500 text-white"}`}>
                  {loadingImage ? "Subiendo..." : "Cambiar foto"}
                  <input
                    type="file"
                    accept=".jpg,.png,.jpeg,.webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={loading || loadingImage}
                  />
                </label>
              </div>

              {/* Sección: Información personal */}
              <div>
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Información personal</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Nombre completo *</label>
                    <input
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                      type="text"
                      name="name"
                      value={playerInput.name}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Apodo</label>
                    <input
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                      type="text"
                      name="alias"
                      value={playerInput.alias}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Ej: Juancho"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Fecha de nacimiento</label>
                    <input
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                      type="date"
                      name="birthdate"
                      value={playerInput.birthdate}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Datos del club */}
              <div>
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Datos del club</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Número</label>
                    <input
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                      type="number"
                      name="number"
                      min="0"
                      max="99"
                      value={playerInput.number}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Ej: 10"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Posición</label>
                    <select
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                      name="position"
                      value={playerInput.position}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Arquero">Arquero</option>
                      <option value="Ala">Ala</option>
                      <option value="Pivote">Pivote</option>
                      <option value="Poste">Poste</option>
                      <option value="Director Técnico">Director Técnico</option>
                      <option value="Ayudante Técnico">Ayudante Técnico</option>
                      <option value="Preparador Físico">Preparador Físico</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 relative" ref={teamSearchRef}>
                    <label className="text-gray-300 text-sm font-medium">Equipo</label>
                    <div
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-700 border cursor-text transition-colors ${
                        teamDropdownOpen ? "border-orange-500" : "border-gray-600"
                      } ${loading ? "opacity-50 pointer-events-none" : ""}`}
                      onClick={() => !loading && setTeamDropdownOpen(true)}
                    >
                      {!teamDropdownOpen && playerInput.current_club_name && (() => {
                        const t = teams.find(t => t.name === playerInput.current_club_name);
                        return t?.logo
                          ? <img src={t.logo} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
                          : null;
                      })()}
                      <input
                        type="text"
                        value={teamDropdownOpen ? teamSearch : (playerInput.current_club_name || "")}
                        onChange={(e) => { setTeamSearch(e.target.value); setTeamDropdownOpen(true); }}
                        onFocus={() => { setTeamSearch(""); setTeamDropdownOpen(true); }}
                        placeholder="Buscar equipo..."
                        disabled={loading}
                        className="flex-1 min-w-0 bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                      />
                      <span className="text-gray-400 text-xs flex-shrink-0">▾</span>
                    </div>

                    {teamDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-xl shadow-2xl z-20 max-h-52 overflow-y-auto">
                        {(() => {
                          const filtered = teams.filter(t =>
                            t.name.toLowerCase().includes(teamSearch.toLowerCase())
                          );
                          return filtered.length === 0 ? (
                            <div className="px-4 py-3 text-gray-400 text-sm">Sin resultados</div>
                          ) : (
                            <>
                              {playerInput.current_club_name && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPlayerInput(prev => ({ ...prev, current_club_name: "" }));
                                    setTeamDropdownOpen(false);
                                    setTeamSearch("");
                                  }}
                                  className="w-full px-4 py-2 text-left text-xs text-gray-400 hover:bg-gray-600 border-b border-gray-600"
                                >
                                  Quitar selección
                                </button>
                              )}
                              {filtered.map((team) => (
                                <button
                                  key={team._id || team.id}
                                  type="button"
                                  onClick={() => {
                                    setPlayerInput(prev => ({ ...prev, current_club_name: team.name }));
                                    setTeamDropdownOpen(false);
                                    setTeamSearch("");
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-600 transition-colors ${
                                    playerInput.current_club_name === team.name ? "bg-gray-600" : ""
                                  }`}
                                >
                                  {team.logo ? (
                                    <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain rounded flex-shrink-0" />
                                  ) : (
                                    <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-xs text-gray-300 flex-shrink-0">?</div>
                                  )}
                                  <span className="text-white text-sm truncate">{team.name}</span>
                                  {playerInput.current_club_name === team.name && (
                                    <span className="ml-auto text-orange-400 text-xs flex-shrink-0">✓</span>
                                  )}
                                </button>
                              ))}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Categoría</label>
                    <select
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                      name="category"
                      value={playerInput.category}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="A1">FSP Masculino</option>
                      <option value="F1">FSP Femenino</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Llegada al club</label>
                    <input
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                      type="date"
                      name="club_arrival"
                      value={playerInput.club_arrival}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Redes sociales */}
              <div>
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Redes sociales</p>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 text-sm font-medium">Instagram</label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-600 focus-within:border-orange-500">
                    <span className="flex items-center px-3 bg-gray-600 text-gray-300 text-sm font-semibold select-none">@</span>
                    <input
                      className="flex-1 px-3 py-2 bg-gray-700 text-white focus:outline-none"
                      type="text"
                      name="instagram"
                      value={playerInput.instagram}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="usuario"
                    />
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || loadingImage}
                  className={`flex-1 flex items-center justify-center gap-2 font-bold rounded-xl py-3 transition-colors ${
                    loading || loadingImage
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-400 text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {isEditing ? "Guardando..." : "Creando..."}
                    </>
                  ) : loadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                      Subiendo imagen...
                    </>
                  ) : (
                    isEditing ? "Guardar cambios" : "Crear jugador"
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 font-bold rounded-xl py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
}
