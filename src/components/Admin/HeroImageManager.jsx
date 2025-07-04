import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Label,
  TextInput,
  Alert,
  Card,
  Spinner,
  Select,
  Badge,
  Table,
} from "flowbite-react";
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
    targetHeight: 600,
    deviceType: "desktop",
    isActive: true,
    order: 0,
    imageFile: null,
  });

  const BASE_URL =
    "https://suela-caramelo-app-back-end.vercel.app/sc/hero-images";
  // const BASE_URL = "http://localhost:3000/sc/hero-images";
  
  // Cargar imágenes
  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL);
      setHeroImages(response.data);
    } catch (err) {
      setError("Error al cargar las imágenes");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  // Manejar cambio de imagen (previsualización)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setError("Solo se permiten archivos de imagen (JPEG, PNG)");
      setTimeout(() => setError(null), 4000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB max
      setError("La imagen no debe exceder los 5MB");
      setTimeout(() => setError(null), 4000);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setFormData({ ...formData, imageFile: file });
  };

  // Subir imagen a Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "suelApp");
    formData.append("folder", "hero_images");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/tablonimus/image/upload",
        formData
      );
      return response.data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw new Error("Error al subir la imagen a Cloudinary");
    }
  };

  // Guardar o actualizar imagen
  const handleSubmit = async () => {
    try {
      setUploading(true);
      setError(null);

      // Validaciones
      if (!formData.name.trim()) {
        throw new Error("El nombre es requerido");
      }
      if (!formData.imageFile && !editingId) {
        throw new Error("Debes seleccionar una imagen");
      }

      let imageUrl = editingId
        ? heroImages.find((img) => img._id === editingId)?.imageUrl
        : null;

      // Subir nueva imagen si es necesario
      if (formData.imageFile && !editingId) {
        imageUrl = await uploadToCloudinary(formData.imageFile);
      }

      // Preparar payload para el backend
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
      setSuccess(
        editingId
          ? "Imagen actualizada exitosamente"
          : "Imagen agregada correctamente"
      );
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message || "Error al procesar la solicitud");
      setTimeout(() => setError(null), 4000);
    } finally {
      setUploading(false);
    }
  };

  // Editar imagen existente
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

  // Eliminar imagen
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta imagen?")) return;

    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setHeroImages((prev) => prev.filter((img) => img._id !== id));
      setSuccess("Imagen eliminada correctamente");
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError("Error al eliminar la imagen");
      setTimeout(() => setError(null), 4000);
    }
  };

  // Cambiar orden
  const updateOrder = async (id, direction) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${BASE_URL}/${id}/order`, {
        direction,
      });
      setHeroImages(response.data);
    } catch (err) {
      setError("Error al actualizar el orden");
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: "",
      redirectUrl: "",
      targetHeight: 600,
      deviceType: "desktop",
      isActive: true,
      order: 0,
      imageFile: null,
    });
    if (previewImage) URL.revokeObjectURL(previewImage);
    setPreviewImage(null);
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Administrador de Hero Images</h1>

      {/* Notificaciones */}
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

      {/* Controles superiores */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Button color="gray" onClick={fetchHeroImages} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Refrescar"}
          </Button>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <FaPlus className="mr-2" />
          Nueva Imagen
        </Button>
      </div>

      {/* Tabla de imágenes */}
      {loading ? (
        <div className="text-center py-8">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Orden</Table.HeadCell>
              <Table.HeadCell>Nombre</Table.HeadCell>
              <Table.HeadCell>Dispositivo</Table.HeadCell>
              <Table.HeadCell>Altura</Table.HeadCell>
              <Table.HeadCell>Estado</Table.HeadCell>
              <Table.HeadCell>Acciones</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {heroImages.map((image) => (
                <Table.Row key={image._id}>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <span>{image.order}</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => updateOrder(image._id, "up")}
                          disabled={loading}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <FaArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => updateOrder(image._id, "down")}
                          disabled={loading}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <FaArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{image.name}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      icon={
                        image.deviceType === "desktop" ? FaDesktop : FaMobile
                      }
                      color={image.deviceType === "desktop" ? "indigo" : "pink"}
                    >
                      {image.deviceType === "desktop" ? "Desktop" : "Mobile"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{image.targetHeight}px</Table.Cell>
                  <Table.Cell>
                    <Badge color={image.isActive ? "success" : "gray"}>
                      {image.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button size="xs" onClick={() => handleEdit(image)}>
                        <FaEdit />
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleDelete(image._id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      {/* Modal para crear/editar */}
      <Modal show={showModal} onClose={resetForm} size="xl">
        <Modal.Header>
          {editingId ? "Editar Imagen" : "Agregar Nueva Imagen"}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" value="Nombre de la imagen*" />
                <TextInput
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ej: Banner Principal Temporada 2023"
                  required
                />
              </div>
              <div>
                <Label htmlFor="targetHeight" value="Altura (px)*" />
                <TextInput
                  id="targetHeight"
                  type="number"
                  min="100"
                  max="2000"
                  value={formData.targetHeight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetHeight: parseInt(e.target.value) || 600,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="redirectUrl"
                value="URL de redirección (opcional)"
              />
              <TextInput
                id="redirectUrl"
                type="url"
                value={formData.redirectUrl}
                placeholder="https://ejemplo.com/promocion-especial"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    redirectUrl: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deviceType" value="Dispositivo*" />
                <Select
                  id="deviceType"
                  value={formData.deviceType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deviceType: e.target.value,
                    })
                  }
                  required
                >
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="order" value="Orden de visualización" />
                <TextInput
                  id="order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image" value="Imagen*" />
              <input
                id="image"
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                required={!editingId}
              />
              <p className="mt-1 text-sm text-gray-500">
                Formatos aceptados: JPEG, PNG (Máx. 5MB)
              </p>

              {previewImage && (
                <div className="mt-4">
                  <Label value="Vista previa" />
                  <div
                    className="mt-1 border rounded-lg overflow-hidden"
                    style={{
                      height: `${formData.targetHeight}px`,
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Altura actual: {formData.targetHeight}px
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isActive: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="isActive" className="ml-2">
                Mostrar en el hero section
              </Label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleSubmit}
            disabled={uploading}
            gradientMonochrome="info"
          >
            {uploading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Procesando...
              </>
            ) : editingId ? (
              "Actualizar Imagen"
            ) : (
              "Guardar Imagen"
            )}
          </Button>
          <Button color="gray" onClick={resetForm} disabled={uploading}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HeroImageDashboard;
