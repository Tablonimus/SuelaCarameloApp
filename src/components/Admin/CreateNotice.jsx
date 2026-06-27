import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createNotice } from "../../redux/actions/index";
import { Modal, Alert } from "flowbite-react";
import { FaPlus, FaEdit, FaEye, FaCheckCircle, FaExclamationCircle, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import NoticeForm from "./NoticeForm";

const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
// const BASE_URL = "http://localhost:3000/sc";

const CATEGORIES = [
  { value: "", label: "Todas las categorías" },
  { value: "FSP Masculino", label: "FSP Masculino" },
  { value: "FSP Femenino", label: "FSP Femenino" },
  { value: "DH", label: "División de Honor" },
  { value: "CM", label: "Copa Mendoza" },
  { value: "TN", label: "Torneos Nacionales" },
  { value: "TI", label: "Torneos Internacionales" },
  { value: "Ascenso", label: "Ascenso" },
];

function getCategoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value ?? "—";
}

export default function CreateNotice({ userRole = "reporter" }) {
  const canApprove = userRole === "admin" || userRole === "reviewer";
  const canDelete  = userRole === "admin";
  const canEdit    = (notice) => userRole === "admin" || userRole === "reviewer" || !notice.is_approved;
  const dispatch = useDispatch();

  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  // Search and filter state
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Debounce searchInput → searchQuery (400ms)
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // When search or category changes, reset to page 1
  useEffect(() => {
    setPage(1);
  }, [searchQuery, categoryFilter]);

  // Fetch whenever page, searchQuery, or categoryFilter change
  useEffect(() => {
    fetchNotices(page);
  }, [page, searchQuery, categoryFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchNotices(p = page) {
    try {
      setLoadingNotices(true);
      const params = new URLSearchParams({ admin: "true", page: p, limit: LIMIT });
      if (searchQuery) params.set("search", searchQuery);
      if (categoryFilter) params.set("category", categoryFilter);
      const res = await fetch(`${BASE_URL}/notices?${params}`);
      const json = await res.json();
      if (Array.isArray(json)) {
        setNotices(json);
        setTotal(json.length);
        setTotalPages(1);
      } else {
        setNotices(json.data ?? []);
        setTotal(json.total ?? 0);
        setTotalPages(json.totalPages ?? 1);
      }
    } catch {
      showError("Error al cargar las noticias");
    } finally {
      setLoadingNotices(false);
    }
  }

  function showError(msg) {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  }

  function showSuccess(msg) {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 4000);
  }

  function openCreate() {
    setEditingNotice(null);
    setShowModal(true);
  }

  function openEdit(notice) {
    setEditingNotice(notice);
    setShowModal(true);
  }

  function closeModal() {
    if (submitting) return;
    setShowModal(false);
    setEditingNotice(null);
  }

  function clearFilters() {
    setSearchInput("");
    setSearchQuery("");
    setCategoryFilter("");
  }

  const hasActiveFilters = searchInput !== "" || categoryFilter !== "";

  async function handleFormSubmit(noticeData) {
    setSubmitting(true);
    try {
      if (editingNotice) {
        const res = await fetch(`${BASE_URL}/notices/${editingNotice._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noticeData),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setNotices((prev) => prev.map((n) => (n._id === editingNotice._id ? updated : n)));
        showSuccess("Noticia actualizada correctamente.");
      } else {
        await dispatch(createNotice(noticeData));
        clearFilters();
        setPage(1);
        await fetchNotices(1);
        showSuccess("Noticia creada correctamente.");
      }
      closeModal();
    } catch {
      showError(editingNotice ? "Error al actualizar la noticia" : "Error al crear la noticia");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleApproval(id) {
    setTogglingId(id);
    try {
      const res = await fetch(`${BASE_URL}/notices/${id}/approve`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setNotices((prev) => prev.map((n) => (n._id === id ? updated : n)));
      showSuccess(updated.is_approved ? "Noticia aprobada." : "Noticia desaprobada.");
    } catch {
      showError("Error al cambiar el estado de aprobación");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDeleteNotice(id) {
    if (!window.confirm("¿Eliminar esta noticia?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${BASE_URL}/notices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setNotices((prev) => prev.filter((n) => n._id !== id));
      setTotal((t) => t - 1);
      showSuccess("Noticia eliminada.");
    } catch {
      showError("Error al eliminar la noticia");
    } finally {
      setDeletingId(null);
    }
  }

  const ApprovalBadge = ({ approved }) => (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${approved ? "bg-green-600 text-white" : "bg-red-700 text-white"}`}>
      {approved ? "Aprobada" : "Pendiente"}
    </span>
  );

  const NoticeActions = ({ notice }) => (
    <div className="flex flex-wrap gap-2">
      <a
        href={`/noticias/${notice._id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-zinc-600 hover:bg-zinc-500 transition-colors"
      >
        <FaEye className="text-xs" />
        <span className="hidden sm:inline">Vista previa</span>
      </a>

      {canEdit(notice) && (
        <button
          onClick={() => openEdit(notice)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <FaEdit className="text-xs" />
          <span>Editar</span>
        </button>
      )}

      {canApprove && (
        <button
          onClick={() => handleToggleApproval(notice._id)}
          disabled={togglingId === notice._id}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors disabled:bg-zinc-500 disabled:cursor-not-allowed ${
            notice.is_approved ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {togglingId === notice._id ? "..." : notice.is_approved ? "Desaprobar" : "Aprobar"}
        </button>
      )}

      {canDelete && (
        <button
          onClick={() => handleDeleteNotice(notice._id)}
          disabled={deletingId === notice._id}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-700 hover:bg-red-600 transition-colors disabled:bg-zinc-500 disabled:cursor-not-allowed"
        >
          <FaTrash className="text-xs" />
          <span className="hidden sm:inline">{deletingId === notice._id ? "..." : "Eliminar"}</span>
        </button>
      )}
    </div>
  );

  const inputClass = "bg-zinc-900 border border-white/10 text-white rounded-lg text-sm placeholder-zinc-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors";

  return (
    <div className="p-3 sm:p-4">
      {error && (
        <Alert color="failure" icon={FaExclamationCircle} className="mb-4">{error}</Alert>
      )}
      {success && (
        <Alert color="success" icon={FaCheckCircle} className="mb-4">{success}</Alert>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Gestión de Noticias</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {hasActiveFilters ? `${total} resultados` : `${total} notas en total`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm flex-shrink-0"
        >
          <FaPlus />
          <span className="hidden sm:inline">Nueva Nota</span>
          <span className="sm:hidden">Nueva</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        {/* Buscador por título */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={`${inputClass} w-full pl-9 pr-9 py-2.5`}
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>
          )}
        </div>

        {/* Filtro por categoría */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`${inputClass} px-3 py-2.5 sm:w-52 cursor-pointer`}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>

        {/* Limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white transition-colors flex-shrink-0"
          >
            <FaTimes className="text-xs" />
            Limpiar
          </button>
        )}
      </div>

      {/* Loading */}
      {loadingNotices ? (
        <div className="flex items-center gap-2 text-white py-8">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-400" />
          <span>Cargando noticias...</span>
        </div>
      ) : notices.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-zinc-400">
            {hasActiveFilters ? "No se encontraron noticias con esos filtros." : "No hay noticias publicadas."}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-2 text-xs text-orange-400 hover:text-orange-300 underline">
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ── Vista mobile: cards ── */}
          <div className="flex flex-col gap-3 md:hidden">
            {notices.map((notice) => (
              <div key={notice._id} className="bg-zinc-800 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-white font-semibold text-sm leading-snug line-clamp-2 flex-1">
                    {notice.title || "(sin título)"}
                  </p>
                  <ApprovalBadge approved={notice.is_approved} />
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="bg-zinc-700 px-2 py-0.5 rounded font-medium text-zinc-300">
                    {getCategoryLabel(notice.category)}
                  </span>
                  <span>
                    {notice.date ? new Date(notice.date).toLocaleDateString("es-AR", { timeZone: "UTC" }) : "—"}
                  </span>
                </div>
                <NoticeActions notice={notice} />
              </div>
            ))}
          </div>

          {/* ── Vista desktop: tabla ── */}
          <div className="hidden md:block overflow-x-auto rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-700 text-zinc-300 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice) => (
                  <tr key={notice._id} className="border-b border-white/10 bg-zinc-800 hover:bg-zinc-700/50 transition-colors">
                    <td className="px-4 py-3 text-white font-medium max-w-xs truncate">
                      {notice.title || "(sin título)"}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{getCategoryLabel(notice.category)}</td>
                    <td className="px-4 py-3 text-zinc-300">
                      {notice.date ? new Date(notice.date).toLocaleDateString("es-AR", { timeZone: "UTC" }) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <ApprovalBadge approved={notice.is_approved} />
                    </td>
                    <td className="px-4 py-3">
                      <NoticeActions notice={notice} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginador */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-5 gap-3 flex-wrap">
              <p className="text-xs text-zinc-500">
                Mostrando {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} de {total} notas
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-2 py-1.5 rounded-lg text-xs text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  «
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-zinc-600 text-xs">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          page === item
                            ? "bg-orange-500 text-white"
                            : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-2 py-1.5 rounded-lg text-xs text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal crear / editar nota */}
      <Modal
        show={showModal}
        onClose={closeModal}
        size="5xl"
        theme={{
          content: {
            inner: "relative flex max-h-[95dvh] sm:max-h-[90dvh] flex-col rounded-none sm:rounded-xl bg-zinc-900 shadow-xl w-full",
            base: "relative w-full p-0 sm:p-4",
          },
          header: {
            base: "flex items-start justify-between rounded-t border-b border-white/10 px-4 sm:px-6 py-4",
            title: "text-base sm:text-lg font-semibold text-white tracking-wide",
            close: {
              base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors",
              icon: "h-5 w-5",
            },
          },
        }}
      >
        <Modal.Header>
          {editingNotice ? "Editar Nota" : "Nueva Nota"}
        </Modal.Header>
        <Modal.Body className="overflow-y-auto bg-zinc-900 px-3 sm:px-6 py-4">
          {showModal && (
            <NoticeForm
              key={editingNotice?._id ?? "new"}
              onSubmit={handleFormSubmit}
              onClose={closeModal}
              submitting={submitting}
              initialData={editingNotice}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
