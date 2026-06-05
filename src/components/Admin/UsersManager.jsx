import React, { useEffect, useState } from "react";
import { Modal, Alert } from "flowbite-react";
import { FaPlus, FaTrash, FaCheckCircle, FaExclamationCircle, FaUserShield, FaUser, FaSearch, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";

const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
// const BASE_URL = "http://localhost:3000/sc";

const ROLE_CONFIG = {
  admin:    { label: "Admin",   color: "bg-orange-500" },
  reviewer: { label: "Revisor", color: "bg-blue-600"   },
  reporter: { label: "Notero",  color: "bg-green-700"  },
};

const defaultForm = { username: "", password: "", confirm: "", role: "reporter" };

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState("");

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch {
      flash("error", "Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  function flash(type, msg) {
    if (type === "error") {
      setError(msg);
      setTimeout(() => setError(null), 4000);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(null), 4000);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.username || !form.password) {
      flash("error", "Usuario y contraseña son obligatorios.");
      return;
    }
    if (form.password !== form.confirm) {
      flash("error", "Las contraseñas no coinciden.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password, role: form.role }),
      });
      const data = await res.json();
      if (!res.ok) { flash("error", data.message || "Error al crear el usuario"); return; }
      setUsers((prev) => [data, ...prev]);
      setForm(defaultForm);
      setShowPwd(false);
      setShowConfirm(false);
      setShowModal(false);
      flash("success", `Usuario "${data.username}" creado.`);
    } catch {
      flash("error", "Error al crear el usuario");
    } finally {
      setCreating(false);
    }
  }

  async function handleRoleChange(id, newRole) {
    setUpdatingId(id);
    try {
      const res = await fetch(`${BASE_URL}/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
      flash("success", "Rol actualizado.");
    } catch {
      flash("error", "Error al cambiar el rol");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id, username) {
    if (!window.confirm(`¿Eliminar al usuario "${username}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.filter((u) => u._id !== id));
      flash("success", `Usuario "${username}" eliminado.`);
    } catch {
      flash("error", "Error al eliminar el usuario");
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass = "bg-zinc-950 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm placeholder-zinc-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400";

  return (
    <div className="p-4">
      {error && (
        <Alert color="failure" icon={FaExclamationCircle} className="mb-4">{error}</Alert>
      )}
      {success && (
        <Alert color="success" icon={FaCheckCircle} className="mb-4">{success}</Alert>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-semibold text-white">Equipo de redacción</h2>
          <p className="text-sm text-zinc-400 mt-0.5">{users.length} usuarios registrados</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <FaPlus />
          Nuevo usuario
        </button>
      </div>

      {/* Buscador */}
      <div className="relative mb-4 max-w-sm">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
        <input
          type="text"
          placeholder="Buscar por usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full ${inputClass} pl-9`}
        />
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center gap-2 text-white py-8">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-400" />
          <span>Cargando usuarios...</span>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-zinc-400 py-8 text-center">No se encontraron usuarios.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-700 text-zinc-300 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Registrado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user._id} className="border-b border-white/10 bg-zinc-800 hover:bg-zinc-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-700 border border-white/10 flex items-center justify-center text-white font-bold text-sm uppercase">
                        {user.username[0]}
                      </div>
                      <span className="text-white font-medium">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      disabled={updatingId === user._id}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`text-xs font-semibold text-white rounded-full px-3 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed ${ROLE_CONFIG[user.role]?.color || "bg-zinc-600"}`}
                    >
                      <option value="admin">Admin</option>
                      <option value="reviewer">Revisor</option>
                      <option value="reporter">Notero</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("es-AR") : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(user._id, user.username)}
                      disabled={deletingId === user._id}
                      className="flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold text-white bg-red-700 hover:bg-red-600 transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed"
                    >
                      <FaTrash />
                      {deletingId === user._id ? "..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal nuevo usuario */}
      <Modal
        show={showModal}
        onClose={() => { if (!creating) { setShowModal(false); setShowPwd(false); setShowConfirm(false); setForm(defaultForm); } }}
        size="md"
        theme={{
          content: {
            inner: "relative flex max-h-[90dvh] flex-col rounded-xl bg-zinc-900 shadow-xl",
          },
          header: {
            base: "flex items-start justify-between rounded-t border-b border-white/10 px-6 py-4",
            title: "text-lg font-semibold text-white tracking-wide",
            close: {
              base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors",
              icon: "h-5 w-5",
            },
          },
        }}
      >
        <Modal.Header>Nuevo usuario</Modal.Header>
        <Modal.Body className="bg-zinc-900">
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Nombre de usuario</label>
              <input
                type="text"
                placeholder="nombre.apellido"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Contraseña</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Mínimo 3 caracteres"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className={`w-full ${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Repetir contraseña</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repetí la contraseña"
                  value={form.confirm}
                  onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                  className={`w-full ${inputClass} pr-10 ${form.confirm && form.password !== form.confirm ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs text-red-400">Las contraseñas no coinciden</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Rol</label>
              <select
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                className={inputClass}
              >
                <option value="reporter">Notero</option>
                <option value="reviewer">Revisor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-600 text-white font-bold rounded-lg py-2.5 text-sm transition-colors"
              >
                {creating ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Creando...</>
                ) : (
                  <><FaPlus /> Crear usuario</>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={creating}
                className="px-5 py-2.5 text-sm font-semibold text-zinc-400 border border-white/20 hover:border-white/40 hover:text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
