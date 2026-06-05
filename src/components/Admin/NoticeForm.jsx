import React, { useState } from "react";
import axios from "axios";
import TinyTextEditor from "../RichTextEditor/TinyTextEditor";
import youtube from "../../assets/images/youtube.png";
import {
  FaNewspaper,
  FaImage,
  FaVideo,
  FaUser,
  FaTag,
  FaCalendarAlt,
  FaUpload,
  FaTimesCircle,
  FaSave,
  FaBan,
} from "react-icons/fa";

function buildInitialInput(data) {
  if (!data) {
    return {
      title: "",
      subtitle: "",
      images: [],
      videos: "",
      authorName: "",
      authorImage: "",
      category: "",
      date: "",
    };
  }
  return {
    title: data.title || "",
    subtitle: data.subtitle || "",
    images: data.images || [],
    videos: typeof data.videos === "string" ? data.videos : "",
    authorName: data.author?.name || "",
    authorImage: data.author?.img || "",
    category: data.category || "",
    date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
  };
}

function SectionHeader({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Icon className="text-orange-400 shrink-0 text-base" />
      <span className="text-orange-400 font-bold text-xs tracking-widest uppercase whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

function UploadButton({ label, accept, onChange, loading, loadingText }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer bg-zinc-900 border border-dashed border-zinc-600 hover:border-orange-400 rounded-lg px-4 py-3 text-sm text-zinc-400 hover:text-orange-300 transition-colors group">
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400 shrink-0" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          <FaUpload className="shrink-0 group-hover:text-orange-400" />
          <span>{label}</span>
        </>
      )}
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
        disabled={loading}
      />
    </label>
  );
}

export default function NoticeForm({ onSubmit, onClose, submitting, initialData }) {
  const isEditing = !!initialData;
  const [input, setInput] = useState(() => buildInitialInput(initialData));
  const [value, setValue] = useState(initialData?.content || "");
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingAuthorImage, setLoadingAuthorImage] = useState(false);
  const [video, setVideo] = useState("");
  const [loadingVideo, setLoadingVideo] = useState(false);

  function handleChange(e) {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleImage(e) {
    const files = e.target.files;
    if (!files?.length) return;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "suelApp");
    data.append("folder", "suelApp");
    try {
      setLoadingImage(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/tablonimus/image/upload",
        data
      );
      setInput((prev) => ({ ...prev, images: [...prev.images, res.data.secure_url] }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingImage(false);
    }
  }

  async function handleAuthorImage(e) {
    const files = e.target.files;
    if (!files?.length) return;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "suelApp");
    data.append("folder", "suelApp");
    try {
      setLoadingAuthorImage(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/tablonimus/image/upload",
        data
      );
      setInput((prev) => ({ ...prev, authorImage: res.data.secure_url }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAuthorImage(false);
    }
  }

  async function handleVideo(e) {
    const files = e.target.files;
    if (!files?.length) return;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "suelApp");
    data.append("folder", "suelApp");
    try {
      setLoadingVideo(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/tablonimus/video/upload",
        data
      );
      setVideo(res.data.secure_url);
      setInput((prev) => ({
        ...prev,
        videos: [...(Array.isArray(prev.videos) ? prev.videos : []), res.data.secure_url],
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingVideo(false);
    }
  }

  function handleDeleteImage(url) {
    setInput((prev) => ({ ...prev, images: prev.images.filter((img) => img !== url) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      title: input.title,
      subtitle: input.subtitle,
      images: input.images,
      videos: input.videos,
      content: value,
      category: input.category,
      author: { name: input.authorName, img: input.authorImage },
      date: new Date(input.date),
    });
  }

  const inputClass =
    "w-full bg-zinc-950 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm placeholder-zinc-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-white">

      {/* ── DATOS BÁSICOS ── */}
      <section className="bg-zinc-800/50 border border-white/10 rounded-xl p-5">
        <SectionHeader icon={FaTag} label="Datos básicos" />
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Categoría</label>
            <select name="category" value={input.category} onChange={handleChange} className={inputClass}>
              <option value="">Seleccione categoría...</option>
              <option value="A1">FSP Masculino</option>
              <option value="F1">FSP Femenino</option>
              <option value="DH">División de Honor</option>
              <option value="CM">Copa Mendoza</option>
              <option value="TN">Torneos Nacionales</option>
              <option value="TI">Torneos Internacionales</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
              <FaCalendarAlt className="text-zinc-500" /> Fecha
            </label>
            <input type="date" name="date" value={input.date} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </section>

      {/* ── CONTENIDO ── */}
      <section className="bg-zinc-800/50 border border-white/10 rounded-xl p-5">
        <SectionHeader icon={FaNewspaper} label="Contenido" />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Titular</label>
            <input
              type="text"
              name="title"
              placeholder="Escribí el título de la nota..."
              value={input.title}
              onChange={handleChange}
              className={`${inputClass} text-base font-semibold`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Bajada / Copete</label>
            <textarea
              name="subtitle"
              placeholder="Un párrafo introductorio que acompañe al titular..."
              rows={2}
              value={input.subtitle}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </section>

      {/* ── MULTIMEDIA ── */}
      <section className="bg-zinc-800/50 border border-white/10 rounded-xl p-5">
        <SectionHeader icon={FaImage} label="Multimedia de encabezado" />
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Imágenes */}
          <div className="flex flex-col gap-3 flex-1">
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">Imagen principal</p>
            <UploadButton
              label="Seleccionar imagen (.jpg, .png)"
              accept=".jpg,.png,.jpeg"
              onChange={handleImage}
              loading={loadingImage}
              loadingText="Subiendo imagen..."
            />
            {input.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {input.images.map((url) => (
                  <div key={url} className="relative group">
                    <img src={url} alt="" className="w-28 h-28 object-cover rounded-lg border border-white/10" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(url)}
                      className="absolute -top-2 -right-2 bg-zinc-900 text-red-400 hover:text-red-300 rounded-full text-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center">
            <div className="h-full w-px bg-white/10" />
          </div>

          {/* YouTube */}
          <div className="flex flex-col gap-3 flex-1">
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">Video YouTube</p>
            <div className="relative flex items-center">
              <img src={youtube} alt="YouTube" className="absolute left-3 h-6 pointer-events-none" />
              <input
                type="text"
                name="videos"
                placeholder="Pegá el ID del video..."
                value={typeof input.videos === "string" ? input.videos : ""}
                onChange={handleChange}
                className={`${inputClass} pl-12 border-red-900/50 focus:border-red-500 focus:ring-red-500`}
              />
            </div>
            <p className="text-xs text-zinc-600">
              Ej: para youtube.com/watch?v=<span className="text-zinc-500">dQw4w9WgXcQ</span>, pegás <span className="text-zinc-500">dQw4w9WgXcQ</span>
            </p>
          </div>

          <div className="hidden lg:flex items-center">
            <div className="h-full w-px bg-white/10" />
          </div>

          {/* Video */}
          <div className="flex flex-col gap-3 flex-1">
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">Subir video</p>
            <UploadButton
              label="Seleccionar video (.mp4)"
              accept=".mp4"
              onChange={handleVideo}
              loading={loadingVideo}
              loadingText="Subiendo video..."
            />
            {!loadingVideo && video && (
              <video src={video} className="w-full rounded-lg border border-white/10" controls />
            )}
          </div>
        </div>
      </section>

      {/* ── CUERPO ── */}
      <section className="bg-zinc-800/50 border border-white/10 rounded-xl p-5">
        <SectionHeader icon={FaNewspaper} label="Cuerpo de la nota" />
        <TinyTextEditor initialValue={value} setValue={setValue} />
      </section>

      {/* ── AUTOR ── */}
      <section className="bg-zinc-800/50 border border-white/10 rounded-xl p-5">
        <SectionHeader icon={FaUser} label="Autor / Firma" />
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Nombre completo</label>
            <input
              type="text"
              name="authorName"
              placeholder="Nombre y apellido del periodista..."
              value={input.authorName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Foto de perfil</label>
            <UploadButton
              label="Subir foto (.jpg, .png)"
              accept=".jpg,.png,.jpeg"
              onChange={handleAuthorImage}
              loading={loadingAuthorImage}
              loadingText="Subiendo foto..."
            />
            {!loadingAuthorImage && input.authorImage && (
              <div className="flex items-center gap-3 mt-1">
                <div className="relative">
                  <img
                    src={input.authorImage}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-400"
                  />
                  <button
                    type="button"
                    onClick={() => setInput((prev) => ({ ...prev, authorImage: "" }))}
                    className="absolute -top-1 -right-1 bg-zinc-900 text-red-400 hover:text-red-300 rounded-full text-base"
                  >
                    <FaTimesCircle />
                  </button>
                </div>
                <span className="text-sm text-zinc-400 truncate">{input.authorName || "Sin nombre"}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── ACCIONES ── */}
      <div className="flex gap-3 pb-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white font-bold rounded-lg py-3 transition-colors text-sm tracking-wide"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              {isEditing ? "Guardando..." : "Publicando..."}
            </>
          ) : (
            <>
              <FaSave />
              {isEditing ? "GUARDAR CAMBIOS" : "PUBLICAR NOTA"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:border-white/40 disabled:opacity-50 text-zinc-400 hover:text-white font-semibold rounded-lg py-3 px-6 transition-colors text-sm"
        >
          <FaBan />
          Cancelar
        </button>
      </div>
    </form>
  );
}
