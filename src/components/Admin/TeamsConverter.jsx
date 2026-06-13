import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTeams, createTeam, updateTeam, deleteTeam } from "../../redux/actions";
import axios from "axios";
import { useToast } from "../../hooks/useToast";
import Toast from "../UI/Toast";

const defaultTeamInput = {
  name: "",
  logo: "",
  address: "",
  foundation: "",
  stadium: "",
  colors: "",
  category: "",
};

export default function TeamsConverter() {
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.allTeams);

  const [loading, setLoading] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [teamInput, setTeamInput] = useState(defaultTeamInput);

  const { showToast, toast } = useToast();

  useEffect(() => {
    dispatch(getAllTeams()).finally(() => setLoadingInitial(false));
  }, [dispatch]);

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
    data.append("folder", "suelApp/teams");

    try {
      setLoadingLogo(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/tablonimus/image/upload",
        data
      );
      setTeamInput((prev) => ({ ...prev, logo: res.data.secure_url }));
    } catch (error) {
      console.log("Error uploading image:", error);
      showToast("Error al subir el logo", "error");
      setPreviewUrl(null);
    } finally {
      setLoadingLogo(false);
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setTeamInput((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!teamInput.name || !teamInput.logo) {
      showToast("El nombre y el logo son obligatorios", "error");
      return;
    }
    setLoading(true);
    try {
      if (isEditing && currentTeam) {
        await dispatch(updateTeam({ ...teamInput, id: currentTeam.id || currentTeam._id }));
        await dispatch(getAllTeams());
        showToast("Equipo actualizado correctamente");
      } else {
        await dispatch(createTeam(teamInput));
        await dispatch(getAllTeams());
        showToast("Equipo creado correctamente");
      }
      closeModal();
      setIsEditing(false);
      setCurrentTeam(null);
      setTeamInput(defaultTeamInput);
    } catch (error) {
      showToast("Error al guardar el equipo", "error");
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setModalOpen(false);
  }

  function handleEdit(team) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setIsEditing(true);
    setCurrentTeam(team);
    setTeamInput({ ...team });
    setModalOpen(true);
  }

  async function handleDelete(team) {
    const id = team.id || team._id;
    if (!window.confirm(`¿Eliminar a ${team.name}?`)) return;
    try {
      await dispatch(deleteTeam(id));
      await dispatch(getAllTeams());
      showToast(`${team.name} eliminado`);
    } catch (error) {
      showToast("Error al eliminar el equipo", "error");
    }
  }

  function openCreateModal() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setIsEditing(false);
    setCurrentTeam(null);
    setTeamInput(defaultTeamInput);
    setModalOpen(true);
  }

  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando equipos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl text-white font-bold mb-6 text-center">Gestión de Equipos</h1>

      <button
        onClick={openCreateModal}
        className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2 rounded-xl mb-4 transition-colors"
      >
        + Nuevo Equipo
      </button>

      <div className="bg-gray-800 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="flex-1 rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none text-sm placeholder-gray-500"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none text-sm"
          >
            <option value="">Todas las categorías</option>
            <option value="A1">A1 — FSP Masculino</option>
            <option value="F1">F1 — FSP Femenino</option>
          </select>
          {(filterName || filterCategory) && (
            <button
              onClick={() => { setFilterName(""); setFilterCategory(""); }}
              className="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          {(() => {
            const filtered = teams.filter((t) => {
              const matchName = t.name?.toLowerCase().includes(filterName.toLowerCase());
              const matchCat = !filterCategory || t.category === filterCategory;
              return matchName && matchCat;
            });
            return (
          <table className="w-full text-white text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left p-3">Logo</th>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Dirección</th>
                <th className="text-left p-3">Fundación</th>
                <th className="text-left p-3">Estadio</th>
                <th className="text-left p-3">Categoría</th>
                <th className="text-left p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((team) => (
                  <tr key={team.id || team._id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-3">
                      {team.logo
                        ? <img src={team.logo} alt={team.name} className="w-10 h-10 object-contain" />
                        : <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-xs">?</div>
                      }
                    </td>
                    <td className="p-3 font-medium">{team.name}</td>
                    <td className="p-3 text-gray-400">{team.address || "—"}</td>
                    <td className="p-3 text-gray-400">{team.foundation || "—"}</td>
                    <td className="p-3 text-gray-400">{team.stadium || "—"}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">{team.category || "—"}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(team)}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(team)}
                          className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-gray-500">
                    {filterName || filterCategory ? "Sin resultados para ese filtro" : "No hay equipos cargados"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
            );
          })()}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl text-white font-bold">
                {isEditing ? "Editar Equipo" : "Nuevo Equipo"}
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

              {/* Logo */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-28 h-28">
                  {(previewUrl || teamInput.logo) ? (
                    <img
                      src={previewUrl || teamInput.logo}
                      alt="Logo del equipo"
                      className={`w-28 h-28 rounded-2xl object-contain border-2 border-gray-600 bg-gray-700 ${loadingLogo ? "opacity-50" : ""}`}
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl bg-gray-700 border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-500 text-xs text-center px-2">
                      Sin logo
                    </div>
                  )}
                  {loadingLogo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-orange-500"></div>
                    </div>
                  )}
                </div>
                <label className={`cursor-pointer text-sm font-medium px-4 py-2 rounded-lg transition-colors ${loading ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-500 text-white"}`}>
                  {loadingLogo ? "Subiendo..." : "Cambiar logo"}
                  <input
                    type="file"
                    accept=".jpg,.png,.jpeg,.webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={loading || loadingLogo}
                  />
                </label>
              </div>

              {/* Sección: Información del equipo */}
              <div>
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Información del equipo</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Nombre *</label>
                    <input
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                      type="text"
                      name="name"
                      value={teamInput.name}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Ej: Club Atlético Suela"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Categoría</label>
                    <select
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                      name="category"
                      value={teamInput.category}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="A1">A1 — FSP Masculino</option>
                      <option value="F1">F1 — FSP Femenino</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Año de fundación</label>
                    <input
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                      type="number"
                      name="foundation"
                      min="1900"
                      max="2099"
                      value={teamInput.foundation}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Ej: 2005"
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Sede */}
              <div>
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Sede</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Dirección</label>
                    <input
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                      type="text"
                      name="address"
                      value={teamInput.address}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Ej: Av. Siempreviva 742"
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Estadio / Cancha</label>
                    <input
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                      type="text"
                      name="stadium"
                      value={teamInput.stadium}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Ej: Polideportivo Municipal"
                    />
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || loadingLogo}
                  className={`flex-1 flex items-center justify-center gap-2 font-bold rounded-xl py-3 transition-colors ${
                    loading || loadingLogo
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-400 text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {isEditing ? "Guardando..." : "Creando..."}
                    </>
                  ) : loadingLogo ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                      Subiendo logo...
                    </>
                  ) : (
                    isEditing ? "Guardar cambios" : "Crear equipo"
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
