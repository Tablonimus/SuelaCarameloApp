import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotices } from "../../redux/actions";
import Notices from "../Notice/Notices";
import NoticeLoaderComponent from "./NoticeLoaderComponent";
import FooterComp from "../FooterComp/FooterComp";
import Sidebar from "../NavBar/Sidebar";
import { FaSearch, FaTimes, FaNewspaper } from "react-icons/fa";
import logoSuela from "../../assets/images/banner2.png";
import SEO from "../SEO/SEO";

const CATEGORIES = [
  { value: "",   label: "Todas",                   icon: FaNewspaper, image: null },
  { value: "FSP Masculino", label: "FSP Masculino",   icon: null,        image: "/botones/A1.png" },
  { value: "FSP Femenino", label: "FSP Femenino",   icon: null,        image: "/botones/F1.png" },
  { value: "DH", label: "División de Honor",        icon: null,        image: "/botones/DH.png" },
  { value: "CM", label: "Copa Mendoza",             icon: null,        image: "/botones/CM.png" },
  { value: "TN", label: "Torneos Nacionales",       icon: null,        image: "/botones/TN.webp" },
  { value: "TI", label: "Torneos Internacionales",  icon: null,        image: "/botones/TI.webp" },
  { value: "Ascenso", label: "Ascenso",            icon: null,        image: "/botones/A1.png" },
];

const NOTICES_PER_PAGE = 8;

export default function Noticias() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const allNotices = useSelector((state) => state.allNotices);

  useEffect(() => {
    dispatch(getAllNotices(category));
  }, [category, dispatch]);

  // Client-side text filter on top of server-side category filter
  const filteredNotices = (allNotices ?? []).filter((n) =>
    n.title?.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [category, searchInput]);

  const totalPages = Math.ceil(filteredNotices.length / NOTICES_PER_PAGE);
  const currentNotices = filteredNotices.slice(
    (currentPage - 1) * NOTICES_PER_PAGE,
    currentPage * NOTICES_PER_PAGE
  );

  const hasActiveSearch = searchInput !== "";
  const selectedCategory = CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[0];

  function goToPage(p) {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <div className="pl-[70px] md:pl-0 flex flex-col min-h-screen bg-zinc-950">
      <SEO
        title="Noticias"
        description="Últimas noticias del fútbol de salón mendocino. Cobertura de FSP Masculino, FSP Femenino, División de Honor, Copa Mendoza y torneos nacionales e internacionales."
        url="/noticias"
      />
      {/* Sidebar mobile toggle */}
      <div className="md:hidden fixed top-0 left-0 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="m-2 p-2 rounded-lg bg-zinc-800 text-white"
        >
          <i className="bx bx-menu text-2xl" />
        </button>
      </div>

      <Sidebar
        active="noticias"
        isMobileOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 md:pl-[70px]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2.5">

            {/* Row 1: logo + title + search */}
            <div className="flex items-center gap-3">
              <img src={logoSuela} alt="Suela Caramelo" className="h-7 object-contain flex-shrink-0" />
              <span className="text-sm font-bold text-white tracking-widest uppercase hidden sm:block flex-shrink-0">
                Noticias
              </span>
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por título..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-zinc-800 border border-white/10 text-white rounded-lg pl-8 pr-8 py-2 text-sm placeholder-zinc-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors"
                />
                {hasActiveSearch && (
                  <button
                    onClick={() => setSearchInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: category pills
                Mobile  → scroll horizontal, label corto
                md+     → wrap en múltiples filas, label completo */}
            <div
              className="flex gap-2 flex-nowrap overflow-x-auto md:flex-wrap md:overflow-x-visible pb-1 md:pb-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] md:text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                      isActive
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                        : "bg-zinc-800 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {/* Imagen PNG si está disponible, si no el ícono de react-icons */}
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt=""
                        className="w-4 h-4 object-contain flex-shrink-0"
                      />
                    ) : (
                      <Icon className="flex-shrink-0 text-[11px]" />
                    )}
                    {cat.label}
                  </button>
                );
              })}
            </div>

          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Contador de resultados */}
          {(hasActiveSearch || category !== "") && allNotices?.length > 0 && filteredNotices.length > 0 && (
            <p className="text-xs text-zinc-500 mb-4">
              {filteredNotices.length} {filteredNotices.length === 1 ? "resultado" : "resultados"}
              {hasActiveSearch && ` para "${searchInput}"`}
              {category && ` · ${selectedCategory.label}`}
            </p>
          )}

          {/* Grid */}
          {allNotices?.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <NoticeLoaderComponent key={i} />)}
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-400 text-base">No se encontraron noticias.</p>
              {hasActiveSearch && (
                <button
                  onClick={() => setSearchInput("")}
                  className="mt-2 text-sm text-orange-400 hover:text-orange-300 underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {currentNotices.map((notice) => (
                <Notices
                  key={notice._id}
                  id={notice._id}
                  title={notice.title}
                  subtitle={notice.subtitle}
                  images={notice.images}
                  videos={notice.videos}
                  author={notice.author}
                  date={notice.date}
                  category={notice.category}
                />
              ))}
            </div>
          )}

          {/* Paginador */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-3">
              <p className="text-xs text-zinc-500 order-2 sm:order-1">
                Mostrando {(currentPage - 1) * NOTICES_PER_PAGE + 1}–{Math.min(currentPage * NOTICES_PER_PAGE, filteredNotices.length)} de {filteredNotices.length}
              </p>
              <div className="flex items-center gap-1 order-1 sm:order-2">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1.5 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  «
                </button>
                <button
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`ell-${idx}`} className="px-2 text-zinc-600 text-sm">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => goToPage(item)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                          currentPage === item
                            ? "bg-orange-500 text-white"
                            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1.5 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <FooterComp />
    </div>
  );
}
