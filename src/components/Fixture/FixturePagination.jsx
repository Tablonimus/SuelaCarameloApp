import React, { useState } from "react";
import Pagination from "../Pagination/Pagination";

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
  const [currentPage, setCurrentPage] = useState(activeNumber || 1);
  const [modalImage, setModalImage]   = useState(null);
  const fixturesPerPage = 1;

  const currentFixture = fixtures?.slice(
    (currentPage - 1) * fixturesPerPage,
    currentPage * fixturesPerPage
  )?.[0];

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
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
          {/* Etiqueta de fase — divisor central */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.22em] whitespace-nowrap">
              {stageLabel}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          {/* Fecha + torneo */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-white leading-none">
                {dateTitle}
              </h3>
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
            {/* Overlay expandir */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-3">
                <ExpandIcon />
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-zinc-600 mt-2">
            Tocá la imagen para ampliar
          </p>
        </div>

        {/* Paginador */}
        <div className="px-5 pb-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          <span className="text-xs text-zinc-500">
            Fecha {currentPage} de {fixtures?.length}
          </span>
          <Pagination
            fixturesPerPage={fixturesPerPage}
            totalFixtures={fixtures?.length}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
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
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between w-full mb-4">
              <div>
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.22em]">
                  {stageLabel}
                </p>
                <h3 className="text-xl font-black text-white">{dateTitle}</h3>
                {currentFixture.playDates?.from && (
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {formatDate(currentFixture.playDates.from)}
                  </p>
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
