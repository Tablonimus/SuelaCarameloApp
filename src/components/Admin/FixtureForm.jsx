import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Label,
  TextInput,
  Select,
  Datepicker,
} from "flowbite-react";
import { FaCalendarAlt } from "react-icons/fa";

const FixtureForm = ({ show, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      number: "",
      stage: "temporada",
      image: "",
      category: "A1",
      season: "2025",
      tournament: "Apertura",
      playDates: { from: "", to: "" },
      matchweek: "",
      is_Active: false,
    }
  );
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        playDates: initialData.playDates || { from: "", to: "" },
      });
      if (initialData.image) {
        setPreviewImage(initialData.image);
      }
    } else {
      setFormData({
        number: "",
        stage: "temporada",
        image: "",
        category: "A1",
        season: "2025",
        tournament: "Apertura",
        playDates: { from: "", to: "" },
        matchweek: "",
        is_Active: false,
      });
      setPreviewImage(null);
    }
    setImageFile(null);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "number" || name === "matchweek"
          ? parseInt(value) || ""
          : value,
    }));
  };

  const handleDateChange = (field, date) => {
    setFormData((prev) => ({
      ...prev,
      playDates: { ...prev.playDates, [field]: date },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones mínimas
    if (!formData.number) return alert("Número de fixture requerido");
    if (!formData.image && !imageFile) return alert("Debes subir una imagen");

    if (formData.stage === "temporada") {
      if (!formData.matchweek)
        return alert("Debes ingresar el número de jornada (matchweek)");
    } else {
      if (!formData.playDates.from || !formData.playDates.to)
        return alert("Debes ingresar fechas válidas para los playoffs");
    }

    const dataToSubmit = {
      ...formData,
      playDates:
        formData.stage === "temporada" ? undefined : formData.playDates,
      matchweek:
        formData.stage !== "temporada" ? undefined : formData.matchweek,
      imageFile,
    };

    onSubmit(dataToSubmit);
  };

  return (
    <Modal show={show} onClose={onClose} size="xl">
      <Modal.Header>
        {initialData ? "Editar Fixture" : "Crear Nuevo Fixture"}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stage" value="Etapa*" />
              <Select
                id="stage"
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                required
              >
                <option value="temporada">Temporada Regular</option>
                <option value="octavos">Octavos</option>
                <option value="cuartos">Cuartos</option>
                <option value="semifinal">Semifinal</option>
                <option value="final">Final</option>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="number"
                value={
                  formData.stage === "temporada"
                    ? "Número de Fecha*"
                    : "Número de Ronda*"
                }
              />
              <TextInput
                id="number"
                name="number"
                type="number"
                min={1}
                value={formData.number}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tournament" value="Torneo*" />
              <Select
                id="tournament"
                name="tournament"
                value={formData.tournament}
                onChange={handleChange}
                required
              >
                <option value="Apertura">Apertura</option>
                <option value="Clausura">Clausura</option>
                <option value="Torneo Anual">Torneo Anual</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="season" value="Temporada*" />
              <TextInput
                id="season"
                name="season"
                value={formData.season}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="category" value="Categoría*" />
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="A1">A1 - FSP Masculino</option>
                <option value="F1">F1 - FSP Femenino</option>
                <option value="A2">A2 - Segunda División</option>
                <option value="F2">F2 - Femenino B</option>
                <option value="DH">DH - Honor</option>
                <option value="TI">TI - Infantiles</option>
                <option value="TN">TN - Novenas</option>
                <option value="CM">CM - Mendoza</option>
              </Select>
            </div>
          </div>

          {formData.stage === "temporada" && (
            <div>
              <Label htmlFor="matchweek" value="Jornada*" />
              <TextInput
                id="matchweek"
                name="matchweek"
                type="number"
                min="1"
                max="38"
                value={formData.matchweek}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {
            <div>
              <Label value="Fechas de Juego*" />
              <div className="flex items-center gap-2">
                <Datepicker
                  value={formData?.playDates?.from}
                  onSelectedDateChanged={(date) =>
                    handleDateChange("from", date)
                  }
                  placeholderText="Desde"
                  required
                  icon={FaCalendarAlt}
                />
                <span>a</span>
                <Datepicker
                  value={formData?.playDates?.to}
                  onSelectedDateChanged={(date) => handleDateChange("to", date)}
                  placeholderText="Hasta"
                  // minDate={formData?.playDates?.from}
                  required
                  icon={FaCalendarAlt}
                />
              </div>
            </div>
          }

          <div>
            <Label htmlFor="image" value="Imagen del Fixture*" />
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required={!initialData}
            />
            {previewImage && (
              <div className="mt-4">
                <Label value="Vista previa" />
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-2 max-h-64 object-contain border rounded"
                />
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.is_Active}
              onChange={(e) =>
                setFormData({ ...formData, is_Active: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="isActive" className="ml-2">
              Marcar como fixture activo
            </Label>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="submit">
              {initialData ? "Actualizar" : "Guardar"}
            </Button>
            <Button color="gray" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default FixtureForm;
