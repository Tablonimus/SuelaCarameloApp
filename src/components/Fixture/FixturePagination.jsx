import React, { useState, useEffect, useRef } from "react";

const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function FixturePagination({ fixtures, activeNumber }) {
  const initialPage = () => {
    if (!activeNumber || !fixtures?.length) return 1;
    const idx = fixtures.findIndex((f) => f.number === activeNumber);
    return idx >= 0 ? idx + 1 : 1;
  };

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [modalImage, setModalImage]   = useState(null);
  const chipsRef                      = useRef(null);
  const activeChipRef                 = useRef(null);
  const isInitialScroll               = useRef(true);

  useEffect(() => {
    setCurrentPage(initialPage());
  }, [fixtures, activeNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  // Centrar el chip activo: instantáneo al cargar, suave en clicks
  useEffect(() => {
    if (activeChipRef.current && chipsRef.current) {
      const container = chipsRef.current;
      const chip      = activeChipRef.current;
      const offset    = chip.offsetLeft - container.clientWidth / 2 + chip.clientWidth / 2;
      container.scrollTo({ left: offset, behavior: isInitialScroll.current ? "instant" : "smooth" });
      isInitialScroll.current = false;
    }
  }, [currentPage]);

  const currentFixture = fixtures?.[currentPage - 1];

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const stageLabel = currentFixture?.stage === "temporada"
    ? "Temporada Regular"
    : currentFixture?.stage;

  const dateTitle = currentFixture?.stage === "temporada"
    ? `Fecha ${currentFixture?.number}`
    : currentFixture?.number;

  if (!currentFixture) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <p className="text-zinc-500 text-sm">No hay fixture disponible para esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-6">

      {/* Card principal */}
      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">

        {/* Info del fixture */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.22em] whitespace-nowrap">
              {stageLabel}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-white leading-none">{dateTitle}</h3>
              {currentFixture.playDates?.from && (
                <p className="text-xs text-zinc-500 mt-1.5">
                  {formatDate(currentFixture.playDates.from)}
                  {currentFixture.playDates.to &&
                    currentFixture.playDates.to !== currentFixture.playDates.from &&
                    <> — {formatDate(currentFixture.playDates.to)}</>}
                </p>
              )}
            </div>
            <span className="flex-shrink-0 bg-zinc-800 border border-white/10 text-zinc-300 text-xs font-semibold px-3 py-1.5 rounded-full">
              {currentFixture.tournament}
            </span>
          </div>
        </div>

        {/* Imagen del fixture */}
        <div className="p-4 sm:p-6">
          <div
            className="relative cursor-zoom-in group rounded-lg overflow-hidden border border-white/10"
            onClick={() => setModalImage(currentFixture.image)}
          >
            <img
              src={currentFixture.image}
              alt={`Fixture ${currentFixture.number}`}
              className="w-full h-auto object-contain transition-all duration-300 group-hover:brightness-90"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-3">
                <ExpandIcon />
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-zinc-600 mt-2">Tocá la imagen para ampliar</p>
        </div>

        {/* Chips de fecha */}
        <div className="px-4 pb-5 border-t border-white/10 pt-4">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2.5">
            Seleccionar jornada
          </p>
          <div
            ref={chipsRef}
            className="flex gap-1.5 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {fixtures.map((f, idx) => {
              const isActive = currentPage === idx + 1;
              const isToday  = f.number === activeNumber;
              return (
                <button
                  key={f._id ?? idx}
                  ref={isActive ? activeChipRef : null}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`flex-shrink-0 min-w-[2.5rem] h-9 px-3 rounded-xl text-sm font-bold transition-all duration-150 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105"
                      : isToday
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30"
                      : "bg-zinc-800 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {f.number}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal pantalla completa */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4"
          onClick={() => setModalImage(null)}
        >
          <div
            className="flex flex-col items-center w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div>
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.22em]">{stageLabel}</p>
                <h3 className="text-xl font-black text-white">{dateTitle}</h3>
                {currentFixture.playDates?.from && (
                  <p className="text-xs text-zinc-500 mt-0.5">{formatDate(currentFixture.playDates.from)}</p>
                )}
              </div>
              <button
                onClick={() => setModalImage(null)}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            <img
              src={modalImage}
              alt="Vista ampliada"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}
