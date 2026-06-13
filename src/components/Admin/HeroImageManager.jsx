import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheckCircle,
  FaExclamationCircle,
  FaDesktop,
  FaMobile,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const HeroImageDashboard = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    redirectUrl: "",
    targetHeight: 400,
    deviceType: "desktop",
    isActive: true,
    order: 0,
    imageFile: null,
  });

  const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc/hero-images";
  // const BASE_URL = "http://localhost:3000/sc/hero-images";

  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL);
      setHeroImages(response.data);
    } catch {
      setError("Error al cargar las imágenes");
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHeroImages(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match("image.*")) {
      setError("Solo se permiten archivos de imagen (JPEG, PNG)");
      setTimeout(() => setError(null), 4000);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe exceder los 5MB");
      setTimeout(() => setError(null), 4000);
      return;
    }
    if (previewImage && !editingId) URL.revokeObjectURL(previewImage);
    setPreviewImage(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, imageFile: file }));
  };

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "suelApp");
    fd.append("folder", "hero_images");
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/tablonimus/image/upload",
      fd
    );
    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      setUploading(true);
      setError(null);

      if (!formData.name.trim()) throw new Error("El nombre es requerido");
      if (!formData.imageFile && !editingId) throw new Error("Debes seleccionar una imagen");

      let imageUrl = editingId
        ? heroImages.find((img) => img._id === editingId)?.imageUrl
        : null;

      if (formData.imageFile) {
        imageUrl = await uploadToCloudinary(formData.imageFile);
      }

      const payload = {
        name: formData.name,
        imageUrl,
        redirectUrl: formData.redirectUrl,
        targetHeight: formData.targetHeight,
        deviceType: formData.deviceType,
        isActive: formData.isActive,
        order: formData.order,
      };

      let response;
      if (editingId) {
        response = await axios.put(`${BASE_URL}/${editingId}`, payload);
      } else {
        response = await axios.post(BASE_URL, payload);
      }

      setHeroImages((prev) =>
        editingId
          ? prev.map((img) => (img._id === editingId ? response.data : img))
          : [...prev, response.data]
      );

      resetForm();
      setSuccess(editingId ? "Imagen actualizada exitosamente" : "Imagen agregada correctamente");
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message || "Error al procesar la solicitud");
      setTimeout(() => setError(null), 4000);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (image) => {
    setFormData({
      name: image.name,
      redirectUrl: image.redirectUrl || "",
      targetHeight: image.targetHeight,
      deviceType: image.deviceType,
      isActive: image.isActive,
      order: image.order,
      imageFile: null,
    });
    setPreviewImage(image.imageUrl);
    setEditingId(image._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta imagen?")) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setHeroImages((prev) => prev.filter((img) => img._id !== id));
      setSuccess("Imagen eliminada correctamente");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Error al eliminar la imagen");
      setTimeout(() => setError(null), 4000);
    }
  };

  const updateOrder = async (id, direction) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${BASE_URL}/${id}/order`, { direction });
      setHeroImages(response.data);
    } catch {
      setError("Error al actualizar el orden");
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", redirectUrl: "", targetHeight: 400, deviceType: "desktop", isActive: true, order: 0, imageFile: null });
    if (previewImage && !editingId) URL.revokeObjectURL(previewImage);
    setPreviewImage(null);
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl text-white font-bold mb-6">Gestión de Banners</h1>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
          <FaExclamationCircle className="flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 text-sm">
          <FaCheckCircle className="flex-shrink-0" /> {success}
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2 rounded-xl mb-6 transition-colors flex items-center gap-2"
      >
        <FaPlus className="text-sm" /> Nuevo Banner
      </button>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando banners...</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-white text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left p-3">Preview</th>
                  <th className="text-left p-3">Nombre</th>
                  <th className="text-left p-3">Dispositivo</th>
                  <th className="text-left p-3">Altura</th>
                  <th className="text-left p-3">Orden</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {heroImages.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-500">
                      No hay banners cargados
                    </td>
                  </tr>
                ) : heroImages.map((image) => (
                  <tr key={image._id} className="border-b border-gray-700 hover:bg-gray-700/40 transition-colors">
                    <td className="p-3">
                      {image.imageUrl ? (
                        <img
                          src={image.imageUrl}
                          alt={image.name}
                          className="w-24 h-12 object-cover rounded-lg border border-gray-600"
                        />
                      ) : (
                        <div className="w-24 h-12 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center text-gray-500 text-xs">
                          Sin imagen
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-medium max-w-[180px] truncate">{image.name}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        image.deviceType === "desktop"
                          ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300"
                          : "bg-pink-500/20 border-pink-500/30 text-pink-300"
                      }`}>
                        {image.deviceType === "desktop" ? <FaDesktop /> : <FaMobile />}
                        {image.deviceType === "desktop" ? "Desktop" : "Mobile"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400">{image.targetHeight}px</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{image.order}</span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => updateOrder(image._id, "up")}
                            disabled={loading}
                            className="text-gray-500 hover:text-orange-400 transition-colors disabled:opacity-30"
                          >
                            <FaArrowUp size={11} />
                          </button>
                          <button
                            onClick={() => updateOrder(image._id, "down")}
                            disabled={loading}
                            className="text-gray-500 hover:text-orange-400 transition-colors disabled:opacity-30"
                          >
                            <FaArrowDown size={11} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {image.isActive ? (
                        <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          Activo
                        </span>
                      ) : (
                        <span className="bg-gray-700 border border-gray-600 text-gray-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(image)}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(image._id)}
                          className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal crear / editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl text-white font-bold">
                {editingId ? "Editar Banner" : "Nuevo Banner"}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                disabled={uploading}
                className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
              >×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

              {/* Preview de imagen */}
              {previewImage && (
                <div className="rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
                  <img
                    src={previewImage}
                    alt="Vista previa"
                    className="w-full max-h-48 object-cover"
                  />
                </div>
              )}

              {/* Info general */}
              <div>
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Información</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Nombre *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Banner Principal Temporada 2025"
                      disabled={uploading}
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">URL de redirección</label>
                    <input
                      type="url"
                      value={formData.redirectUrl}
                      onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                      placeholder="https://..."
                      disabled={uploading}
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Dispositivo *</label>
                    <select
                      value={formData.deviceType}
                      onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                      disabled={uploading}
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="desktop">Desktop</option>
                      <option value="mobile">Mobile</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Altura (px)</label>
                    <input
                      type="number"
                      min="100"
                      max="2000"
                      value={formData.targetHeight}
                      onChange={(e) => setFormData({ ...formData, targetHeight: parseInt(e.target.value) || 400 })}
                      disabled={uploading}
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-sm font-medium">Orden</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      disabled={uploading}
                      className="rounded-lg px-3 py-2 bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Imagen */}
              <div>
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Imagen *</p>
                <label className={`cursor-pointer inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${uploading ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-500 text-white"}`}>
                  {editingId ? "Cambiar imagen" : "Seleccionar imagen"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploading}
                    required={!editingId}
                  />
                </label>
                <p className="mt-1.5 text-xs text-gray-500">JPEG, PNG, WebP · Máx. 5 MB</p>
              </div>

              {/* Visible en hero */}
              <div className="flex items-center gap-3">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  disabled={uploading}
                  className="w-4 h-4 rounded accent-orange-500"
                />
                <label htmlFor="isActive" className="text-gray-300 text-sm font-medium cursor-pointer">
                  Mostrar en el hero section
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 flex items-center justify-center gap-2 font-bold rounded-xl py-3 transition-colors ${
                    uploading ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-400 text-white"
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Subiendo...
                    </>
                  ) : (editingId ? "Guardar cambios" : "Crear banner")}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={uploading}
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
  );
};

export default HeroImageDashboard;
