import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  createManyTeamsByExcel,
  createPlayersByExcel,
} from "../../redux/actions";
import axios from "axios";

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
  const teams  = useSelector((state) => state.allTeams);
  console.log('equipos',teams)

  const [loading, setLoading] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [teamInput, setTeamInput] = useState(defaultTeamInput);

  useEffect(() => {
    dispatch(getAllTeams()).finally(() => setLoadingInitial(false));
  }, [dispatch]);

  const handleImageUpload = useCallback(async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

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
      setTeamInput((prev) => ({
        ...prev,
        logo: res.data.secure_url,
      }));
    } catch (error) {
      console.log("Error uploading image:", error);
      alert("Error al subir la imagen");
    } finally {
      setLoadingLogo(false);
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setTeamInput((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (teamInput.name && teamInput.logo) {
      setLoading(true);
      if (isEditing && currentTeam) {
        dispatch(updateTeam({ ...teamInput, id: currentTeam.id || currentTeam._id })).then(() => {
          dispatch(getAllTeams()).finally(() => {
            setLoading(false);
            setModalOpen(false);
            setIsEditing(false);
            setCurrentTeam(null);
            setTeamInput(defaultTeamInput);
          });
        });
      } else {
        dispatch(createTeam(teamInput)).then(() => {
          dispatch(getAllTeams()).finally(() => {
            setLoading(false);
            setModalOpen(false);
            setTeamInput(defaultTeamInput);
          });
        });
      }
    } else {
      alert("El nombre y el logo son obligatorios");
    }
  }

  function handleEdit(team) {
    setIsEditing(true);
    setCurrentTeam(team);
    setTeamInput({ ...team });
    setModalOpen(true);
  }

  function handleDelete(team) {
    const id = team.id || team._id;
    if (window.confirm("¿Estás seguro de eliminar este equipo?")) {
      dispatch(deleteTeam(id)).then(() => {
        dispatch(getAllTeams());
      });
    }
  }

  function openCreateModal() {
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
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700"
      >
        Crear Equipo
      </button>

      <div className="bg-gray-700 rounded-lg p-4">
        <h2 className="text-2xl text-white font-bold mb-4">Equipos Existentes</h2>
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left p-2">Logo</th>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Dirección</th>
              <th className="text-left p-2">Fundación</th>
              <th className="text-left p-2">Estadio</th>
              <th className="text-left p-2">Colores</th>
              <th className="text-left p-2">Categoría</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            
            {teams.length > 0 ? (
              teams.map((team) => (
                <tr key={team.id || team._id} className="border-b border-gray-600">
                  <td className="p-2">
                    {team.logo && (
                      <img src={team.logo} alt={team.name} className="w-12 h-12 object-contain" />
                    )}
                  </td>
                  <td className="p-2">{team.name}</td>
                  <td className="p-2">{team.address}</td>
                  <td className="p-2">{team.foundation}</td>
                  <td className="p-2">{team.stadium}</td>
                  <td className="p-2">{team.colors}</td>
                  <td className="p-2">{team.category}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(team)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4">No hay equipos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-700 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl text-white font-bold mb-4">
              {isEditing ? "Editar Equipo" : "Crear Equipo"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col">
                <label className="text-white font-semibold">Nombre *</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="name"
                  value={teamInput.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Logo *</label>
                <input
                  type="file"
                  accept=".jpg, .png, .jpeg, .webp"
                  onChange={handleImageUpload}
                  className="rounded-lg p-2 bg-amber-600 text-white"
                  disabled={loading}
                />
                {loadingLogo ? (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                    <span className="text-orange-400">Subiendo imagen...</span>
                  </div>
                ) : teamInput.logo ? (
                  <div className="relative mt-2">
                    <img
                      src={teamInput.logo}
                      alt="Team logo"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Dirección</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="address"
                  value={teamInput.address}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Fundación</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="foundation"
                  value={teamInput.foundation}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Estadio</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="stadium"
                  value={teamInput.stadium}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Colores</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="colors"
                  value={teamInput.colors}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold">Categoría</label>
                <input
                  className="rounded-lg p-2 text-black"
                  type="text"
                  name="category"
                  value={teamInput.category}
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
                    isEditing ? "Guardar Cambios" : "Crear Equipo"
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
