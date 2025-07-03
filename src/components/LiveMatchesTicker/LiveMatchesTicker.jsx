import React, { useState, useEffect } from "react";
import logoSC from "../../assets/images/banner2.png";
import { FaFutbol, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import logoA1 from "../../assets/images/botones/A1.png";
import logoF1 from "../../assets/images/botones/F1.png";

const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";

const statusMap = {
  first_half: "1T",
  halftime: "Descanso",
  second_half: "2T",
  extra_time: "T.E.",
  penalties: "Penales",
  pending: "Próximo",
  finished: "Final",
  suspended: "Suspendido",
  canceled: "Cancelado",
  postponed: "Postergado",
};

const LiveMatchesTicker = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasLiveMatches, setHasLiveMatches] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("A1");

  const categories = [
    { value: "A1", label: "FSP Masculino", logo: logoA1 },
    // { value: "F1", label: "FSP Femenino", logo: logoF1 }, // Descomentar cuando tengas esta categoría
  ];

  const selectedCategory =
    categories.find((cat) => cat.value === currentCategory) || categories[0];

  const isLiveMatch = (match) => {
    const liveStatuses = [
      "first_half",
      "halftime",
      "second_half",
      "extra_time",
      "penalties",
    ];
    return liveStatuses.includes(match.status);
  };

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const response = await fetch(BASE_URL + "/matches/live");
        const data = await response.json();
        setMatches(data);
        setHasLiveMatches(data.some(isLiveMatch));
        setLoading(false);
        const interval = setInterval(async () => {
          const res = await fetch(BASE_URL + "/matches/live");
          const updated = await res.json();
          setMatches(updated);
          setHasLiveMatches(updated.some(isLiveMatch));
        }, 30000);

        return () => clearInterval(interval);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setLoading(false);
      }
    };

    fetchLiveMatches();
  }, []);

  const scroll = (direction) => {
    const container = document.getElementById("matches-ticker");
    const scrollAmount = 300;
    if (container) {
      container.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
      setScrollPosition(container.scrollLeft);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 py-3 px-4 text-white text-center text-sm">
        Cargando partidos...
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-zinc-900 py-3 px-4 text-white text-center text-sm">
        No hay partidos en este momento
      </div>
    );
  }

  return (
    <div className="relative bg-zinc-900 text-white overflow-hidden  shadow-lg">
      {/* Header compacto */}
      {/* Mostrar "EN VIVO" solo si hay partidos en curso */}

      {/* Contenido de partidos */}
      <div className="relative py-2 px-1">
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
          <div
            className="flex items-center space-x-2 text-sm font-medium text-orange-400 cursor-pointer hover:text-orange-300 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {/* {selectedCategory.logo && (
            <img
              src={selectedCategory.logo}
              alt={selectedCategory.label}
              className="h-5 w-5 object-contain rounded-full"
            />
          )} */}
            <span>{selectedCategory.label}</span>
            <svg
              className={`ml-1 w-3 h-3 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Menú desplegable (aparecerá cuando haya más categorías) */}
          {isDropdownOpen && (
            <div className="absolute z-20 mt-2 left-0 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg w-48 overflow-hidden">
              {categories.map((category) => (
                <div
                  key={category.value}
                  className={`flex items-center px-3 py-2 cursor-pointer transition-colors ${
                    currentCategory === category.value
                      ? "bg-zinc-700/50 text-orange-400"
                      : "hover:bg-zinc-700 text-white"
                  }`}
                  onClick={() => {
                    setCurrentCategory(category.value);
                    setIsDropdownOpen(false);
                  }}
                >
                  <img
                    src={category.logo}
                    alt={category.label}
                    className="h-5 w-5 object-contain rounded-full mr-2"
                  />
                  <span>{category.label}</span>
                </div>
              ))}
            </div>
          )}
          {hasLiveMatches && (
            <div className="flex items-center space-x-1 text-sm lg:text-xl text-gray-300">
              <FaFutbol className="text-green-400 animate-pulse" />
              <span>EN VIVO</span>
            </div>
          )}
        </div>

        {scrollPosition > 0 && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-1 rounded-r"
          >
            <FaChevronLeft className="text-white text-lg" />
          </button>
        )}

        <div
          id="matches-ticker"
          className="flex  overflow-x-auto space-x-3 px-3 scrollbar-none py-1"
          onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
        >
          {matches.map((match) => (
            <div
              key={match._id}
              className="flex-shrink-0 bg-zinc-800 border border-zinc-700 p-2 rounded-lg w-48"
            >
              <div className="flex items-center justify-between space-x-2">
                {/* Equipo local */}
                <div className="flex flex-col items-center w-16">
                  <img
                    src={match.local.logo}
                    alt={match.local.name}
                    className="h-8 w-8 object-contain"
                  />
                  <span className="text-xs mt-1 text-center truncate w-full">
                    {match.local.shortName || match.local.name.split(" ")[0]}
                  </span>
                </div>

                {/* Marcador y estado */}
                <div className="flex flex-col items-center justify-center min-w-[40px]">
                  <div className="text-lg font-bold flex items-center gap-1">
                    <span>
                      {["pending", "postponed"].includes(match.status)
                        ? "-"
                        : match.score?.local ?? 0}
                    </span>
                    <span className="text-gray-400">-</span>
                    <span>
                      {["pending", "postponed"].includes(match.status)
                        ? "-"
                        : match.score?.visitor ?? 0}
                    </span>
                  </div>

                  {match.status === "penalties" ||
                    (match.penaltyScore?.local ||
                    match.penaltyScore?.visitor ? (
                      <div className="text-[10px] text-gray-300">
                        ({match.penaltyScore?.local ?? 0}-
                        {match.penaltyScore?.visitor ?? 0})
                      </div>
                    ) : (
                      false
                    ))}

                  <div className="flex items-center mt-1 text-[10px] text-gray-200">
                    {!["pending", "postponed"].includes(match.status) && (
                      <FaFutbol
                        className={`mr-1 ${
                          match.status === "finished"
                            ? "text-white"
                            : "text-green-400 animate-pulse"
                        }`}
                      />
                    )}
                    <span>{statusMap[match.status] ?? "-"}</span>
                  </div>
                </div>

                {/* Equipo visitante */}
                <div className="flex flex-col items-center w-16">
                  <img
                    src={match.visitor.logo}
                    alt={match.visitor.name}
                    className="h-8 w-8 object-contain"
                  />
                  <span className="text-xs mt-1 text-center truncate w-full">
                    {match.visitor.shortName ||
                      match.visitor.name.split(" ")[0]}
                  </span>
                </div>
              </div>

              {match.status === "pending" && (
                <div className="text-center text-[10px] text-gray-400 mt-1">
                  {`${parseInt(match.date.substr(8, 2))}/${parseInt(
                    match.date.substr(5, 2)
                  )} - ${match.time} hr`}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-1 rounded-l"
        >
          <FaChevronRight className="text-white text-lg" />
        </button>
      </div>

      {/* Links rápidos */}
      <div className="flex justify-center gap-4 px-2 py-2 bg-zinc-800 border-t border-zinc-700 text-xs">
        <a
          href="/fixture"
          className="text-white hover:text-orange-400 transition px-2 py-1 rounded hover:bg-zinc-700"
        >
          Fixture
        </a>
        <a
          href="/posiciones"
          className="text-white hover:text-orange-400 transition px-2 py-1 rounded hover:bg-zinc-700"
        >
          Posiciones
        </a>
        {/* <a
          href="/equipos"
          className="text-white hover:text-orange-400 transition px-2 py-1 rounded hover:bg-zinc-700"
        >
          Equipos
        </a> */}
      </div>
    </div>
  );
};

export default LiveMatchesTicker;
