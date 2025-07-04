import React, { useState } from "react";
import Pagination from "../Pagination/Pagination";
import NoticeLoaderComponent from "../Home/NoticeLoaderComponent";

export default function FixturePagination({ fixtures, activeNumber }) {
  const [currentPage, setCurrentPage] = useState(activeNumber || 1);

  const [modalImage, setModalImage] = useState(null);
  const fixturesPerPage = 1;

  const currentFixtures = fixtures?.slice(
    (currentPage - 1) * fixturesPerPage,
    currentPage * fixturesPerPage
  );

  const currentFixture = currentFixtures?.[0];

  const formatDate = (dateString) => {
    if (!dateString) return "No definida";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4">
      {currentFixture ? (
        <div className="bg-zinc-900 rounded-lg shadow-sm overflow-hidden">
          {/* Sección de información del fixture */}
          <div className="p-4 bg-zinc-800 border-b border-zinc-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {currentFixture.stage === "temporada"
                    ? `Fecha ${currentFixture.number}`
                    : currentFixture.number}
                </h3>
                <p className="text-orange-400 capitalize">
                  {currentFixture.stage === "temporada"
                    ? "Temporada Regular"
                    : currentFixture.stage}
                </p>
              </div>

              <div className="text-right">
                <p className="text-white">
                  <span className="text-gray-400">Torneo: </span>
                  {currentFixture.tournament}
                </p>
                {currentFixture.playDates?.from && (
                  <p className="text-white">
                    <span className="text-gray-400">Jugado: </span>
                    {formatDate(currentFixture.playDates.from)} -{" "}
                    {formatDate(currentFixture.playDates.to)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contenedor principal de imagen y paginación */}
          <div className="flex flex-col md:flex-row max-h-[70vh]">
            <div className="flex-1 flex flex-col">
              {/* Imagen del Fixture */}
              <div className="p-4 flex-1 flex items-center justify-center">
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setModalImage(currentFixture.image)}
                >
                  <img
                    src={currentFixture.image}
                    alt={`Fixture ${currentFixture.number}`}
                    className="rounded-lg max-w-full h-full max-h-[50vh] transition-transform group-hover:brightness-95"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2 backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Paginador */}
              <div className="p-3 border-t border-zinc-700">
                <div className="flex justify-center">
                  <Pagination
                    fixturesPerPage={fixturesPerPage}
                    totalFixtures={fixtures?.length}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-64 flex justify-center items-center bg-zinc-900 rounded-lg shadow-sm">
          <NoticeLoaderComponent />
        </div>
      )}

      {/* Modal para imagen en pantalla completa */}
      {modalImage && (
        <div
          className="ml-[70px] fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="max-w-full max-h-full flex flex-col items-center">
            <h3 className="text-2xl font-medium text-white mb-4 text-center">
              {currentFixture?.stage === "temporada"
                ? `Fecha ${currentFixture?.number}`
                : currentFixture?.number}
            </h3>
            {currentFixture?.playDates?.from && (
              <p className="text-white mb-2">
                {formatDate(currentFixture.playDates.from)} -{" "}
                {formatDate(currentFixture.playDates.to)}
              </p>
            )}
            <img
              src={modalImage}
              alt="Vista ampliada"
              className="max-w-full max-h-[80vh] object-contain"
            />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={() => setModalImage(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
