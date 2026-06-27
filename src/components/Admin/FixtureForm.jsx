import React, { useState, useEffect } from "react";

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const toDateInput = (val) => {
  if (!val) return "";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

const EMPTY_FORM = {
  number:     "",
  stage:      "temporada",
  image:      "",
  category:   "FSP Masculino",
  season:     "2026",
  tournament: "Apertura",
  playDates:  { from: "", to: "" },
  matchweek:  "",
  is_Active:  false,
};

const inputClass =
  "w-full rounded-xl px-3 py-2.5 bg-gray-800 text-white border border-gray-600 focus:border-orange-500 focus:outline-none text-sm placeholder-gray-500 transition-colors";

const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5";

const FixtureForm = ({ show, onClose, onSubmit, initialData }) => {
  const [formData, setFormData]     = useState(EMPTY_FORM);
  const [imageFile, setImageFile]   = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...EMPTY_FORM,
        ...initialData,
        playDates: {
          from: toDateInput(initialData.playDates?.from),
          to:   toDateInput(initialData.playDates?.to),
        },
      });
      setPreviewImage(initialData.image || null);
    } else {
      setFormData(EMPTY_FORM);
      setPreviewImage(null);
    }
    setImageFile(null);
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "number" || name === "matchweek" ? parseInt(value) || "" : value,
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
    if (!formData.number)            return alert("Número de fecha requerido");
    if (!formData.image && !imageFile) return alert("Debes subir una imagen");
    if (formData.stage === "temporada" && !formData.matchweek)
      return alert("Debes ingresar el número de jornada");
    if (formData.stage !== "temporada" && (!formData.playDates.from || !formData.playDates.to))
      return alert("Debes ingresar fechas válidas para el playoff");

    onSubmit({
      ...formData,
      playDates:  formData.stage === "temporada" ? undefined : formData.playDates,
      matchweek:  formData.stage !== "temporada" ? undefined : formData.matchweek,
      imageFile,
    });
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">

        {/* Header del modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">
              {initialData ? "Editar Fixture" : "Nuevo Fixture"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {initialData ? "Modificá los datos del fixture" : "Completá los datos para crear una nueva fecha"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <XIcon />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Etapa + Número */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Etapa *</label>
              <select name="stage" value={formData.stage} onChange={handleChange} className={inputClass}>
                <option value="temporada">Temporada Regular</option>
                <option value="octavos">Octavos de Final</option>
                <option value="cuartos">Cuartos de Final</option>
                <option value="semifinal">Semifinal</option>
                <option value="final">Final</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                {formData.stage === "temporada" ? "Número de Fecha *" : "Número de Ronda *"}
              </label>
              <input
                type="number"
                name="number"
                min={1}
                value={formData.number}
                onChange={handleChange}
                placeholder="Ej: 12"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Torneo + Temporada + Categoría */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Torneo *</label>
              <select name="tournament" value={formData.tournament} onChange={handleChange} className={inputClass}>
                <option value="Apertura">Apertura</option>
                <option value="Clausura">Clausura</option>
                <option value="Torneo Anual">Torneo Anual</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Temporada *</label>
              <input
                type="text"
                name="season"
                value={formData.season}
                onChange={handleChange}
                placeholder="2026"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Categoría *</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                <option value="FSP Masculino">FSP Masculino</option>
                <option value="FSP Femenino">FSP Femenino</option>
                <option value="A2">A2 - Segunda Div.</option>
                <option value="F2">F2 - Femenino B</option>
                <option value="DH">DH - Honor</option>
                <option value="TI">TI - Infantiles</option>
                <option value="TN">TN - Novenas</option>
                <option value="CM">CM - Mendoza</option>
              </select>
            </div>
          </div>

          {/* Jornada (solo temporada regular) */}
          {formData.stage === "temporada" && (
            <div>
              <label className={labelClass}>Jornada *</label>
              <input
                type="number"
                name="matchweek"
                min={1}
                max={38}
                value={formData.matchweek}
                onChange={handleChange}
                placeholder="Ej: 12"
                className={inputClass}
              />
              <p className="text-xs text-gray-500 mt-1">
                Número de semana dentro del torneo (distinto al número de fecha)
              </p>
            </div>
          )}

          {/* Fechas de juego (playoffs) */}
          {formData.stage !== "temporada" && (
            <div>
              <label className={labelClass}>Fechas de Juego *</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Desde</p>
                  <input
                    type="date"
                    value={formData.playDates?.from || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        playDates: { ...prev.playDates, from: e.target.value },
                      }))
                    }
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Hasta</p>
                  <input
                    type="date"
                    value={formData.playDates?.to || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        playDates: { ...prev.playDates, to: e.target.value },
                      }))
                    }
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Imagen */}
          <div>
            <label className={labelClass}>Imagen del Fixture *</label>
            {previewImage && (
              <div className="mb-3 rounded-xl overflow-hidden border border-gray-700">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full max-h-48 object-contain bg-gray-800"
                />
              </div>
            )}
            <label className="flex items-center gap-3 cursor-pointer w-full px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {previewImage ? "Cambiar imagen" : "Subir imagen"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required={!initialData}
              />
            </label>
          </div>

          {/* Marcar activo */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.is_Active}
                onChange={(e) => setFormData({ ...formData, is_Active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-gray-700 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-sm text-gray-300">Marcar como fecha activa</span>
          </label>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition-colors"
            >
              {initialData ? "Actualizar Fixture" : "Crear Fixture"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FixtureForm;
