import React from "react";

export default function Pagination({
  fixturesPerPage,
  totalFixtures,
  currentPage,
  onPageChange,
  vertical = false,
}) {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalFixtures / fixturesPerPage);
  const maxVisibleButtons = 5;

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getVisiblePages = () => {
    if (totalPages <= maxVisibleButtons) return pageNumbers;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      end = maxVisibleButtons;
    } else if (currentPage >= totalPages - 2) {
      start = totalPages - maxVisibleButtons + 1;
    }

    const visible = [];
    for (let i = start; i <= end; i++) {
      visible.push(i);
    }

    return visible;
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      className={`flex ${
        vertical ? "flex-col space-y-2" : "flex-row space-x-2"
      } items-center justify-center`}
    >
      {/* Botón Anterior */}
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-zinc-700 text-white hover:bg-zinc-600 transition-colors`}
          aria-label="Página anterior"
        >
          {vertical ? "↑" : "←"}
        </button>
      )}

      {/* Primer botón + elipsis */}
      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md ${
              1 === currentPage
                ? "bg-orange-500 text-white"
                : "bg-zinc-700 text-white hover:bg-zinc-600"
            } transition-colors`}
          >
            1
          </button>
          {visiblePages[0] > 2 && <span className="text-white">...</span>}
        </>
      )}

      {/* Botones visibles */}
      {visiblePages.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md transition-colors ${
            currentPage === number
              ? "bg-orange-500 text-white"
              : "bg-zinc-700 text-white hover:bg-zinc-600"
          }`}
        >
          {number}
        </button>
      ))}

      {/* Último botón + elipsis */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="text-white">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md ${
              totalPages === currentPage
                ? "bg-orange-500 text-white"
                : "bg-zinc-700 text-white hover:bg-zinc-600"
            } transition-colors`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Botón Siguiente */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-zinc-700 text-white hover:bg-zinc-600 transition-colors`}
          aria-label="Página siguiente"
        >
          {vertical ? "↓" : "→"}
        </button>
      )}
    </div>
  );
}
