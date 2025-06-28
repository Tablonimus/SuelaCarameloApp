import React, { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import { useSelector } from "react-redux";
import NoticeLoaderComponent from "../Home/NoticeLoaderComponent";

export default function FixturePagination({
  fixtures,
  activeNumber,
  setCurrentPageTitle,
}) {
  const [currentPage, setCurrentPage] = useState(activeNumber);
  const [modalImage, setModalImage] = useState(null);
  const fixturesPerPage = 1;

  useEffect(() => {
    setCurrentPage(activeNumber);
  }, [activeNumber, fixtures]);

  const currentFixtures = fixtures?.slice(
    (currentPage - 1) * fixturesPerPage,
    currentPage * fixturesPerPage
  );

  function handlePageChange(page) {
    setCurrentPageTitle(page);
    setCurrentPage(page);
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4">
      {currentFixtures?.length > 0 ? (
        <div className="bg-zinc-900 rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row max-h-[70vh]">
          {/* Contenido Principal */}
          <div className="flex-1 flex flex-col">
            {/* Imagen del Fixture */}
            <div className="p-4 flex-1 flex items-center justify-center ">
              <div
                className="relative cursor-pointer group"
                onClick={() => setModalImage(currentFixtures[0].image)}
              >
                <img
                  src={currentFixtures[0].image}
                  alt={`Fixture fecha ${currentPage}`}
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
            {/* Paginador Horizontal - Solo visible en mobile */}
            <div className=" p-3 border-b border-zinc-700">
              <div className="flex justify-center">
                <Pagination
                  fixturesPerPage={fixturesPerPage}
                  totalFixtures={fixtures?.length}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
          {/* Paginador Vertical - Solo visible en desktop */}
          {/* <div className="hidden md:flex flex-col items-center justify-center p-4 bg-zinc-800 border-r border-zinc-700">
            <h3 className="text-lg font-medium text-white mb-4 text-center">
              Fechas
            </h3>
            <div className="flex flex-col items-center space-y-2 h-full justify-center">
              <Pagination
                fixturesPerPage={fixturesPerPage}
                totalFixtures={fixtures?.length}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                vertical={true}
              />
            </div>
          </div> */}
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
              Fecha {currentPage}
            </h3>
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
