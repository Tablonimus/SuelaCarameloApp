import React, { useState, useEffect } from "react";
import { FaFutbol, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
// const BASE_URL = "http://localhost:3000/sc";

const LiveMatchesTicker = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Fetch matches data
  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const response = await fetch(BASE_URL + "/matches/live");
        const data = await response.json();
        setMatches(data);
        setLoading(false);

        // Refresh data every 30 seconds for live updates
        const interval = setInterval(async () => {
          const updatedResponse = await fetch(BASE_URL + "/matches/live");
          const updatedData = await updatedResponse.json();
          setMatches(updatedData);
        }, 30000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setLoading(false);
      }
    };

    fetchLiveMatches();
  }, []);

  const scroll = (direction) => {
    const container = document.getElementById("matches-ticker");
    const scrollAmount = 300; // Adjust scroll amount as needed
    if (container) {
      if (direction === "left") {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
      setScrollPosition(container.scrollLeft);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 py-2 px-4 text-white text-center">
        Cargando partidos...
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-gray-800 py-2 px-4 text-white text-center">
        No hay partidos en este momento
      </div>
    );
  }

  return (
    <div className="relative bg-gray-400 text-white py-2 ">
      {/* Left scroll button (only visible when scrolled right) */}
      {scrollPosition > 0 && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 bg-gray-900 bg-opacity-50 px-2 flex items-center justify-center"
        >
          <FaChevronLeft className="text-xl" />
        </button>
      )}

      {/* Matches ticker */}
      <div
        id="matches-ticker"
        className="flex overflow-x-auto scrollbar-   whitespace-nowrap px-2  "
        onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
      >
        {matches.map((match) => (
          <div
            key={match._id}
            className="inline-block mx-4 px-4 py-2 bg-gray-700 rounded-lg border-l-4 border-orange-500"
          >
            <div className="flex items-center justify-between min-w-[280px]">
              {/* Local team */}
              <div className="text-center w-24">
                <img
                  src={match.local.logo}
                  alt={match.local.name}
                  className="h-8 mx-auto mb-1"
                />
                <span className="text-sm font-semibold">
                  {match.local.name}
                </span>
              </div>

              {/* Match score */}
              <div className="px-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-bold">
                    {match.status === "pending" &&
                    (match.score?.local === 0 ||
                      match.score?.local === undefined)
                      ? "-"
                      : match.score?.local ?? 0}
                  </span>
                  <span className="text-gray-400">-</span>
                  <span className="text-2xl font-bold">
                    {match.status === "pending" &&
                    (match.score?.visitor === 0 ||
                      match.score?.visitor === undefined)
                      ? "-"
                      : match.score?.visitor ?? 0}
                  </span>
                </div>

                {/* Match status */}
                <div className="flex items-center justify-center mt-1">
                  <FaFutbol
                    className={`mr-1 ${
                      match.status === "playing"
                        ? "text-green-500 animate-pulse"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="text-xs uppercase">
                    {match.status === "playing"
                      ? "En vivo"
                      : match.status === "finished"
                      ? "Finalizado"
                      : match.status === "pending"
                      ? "Próximo"
                      : match.status === "postponed"
                      ? "Postergado"
                      : match.status === "canceled"
                      ? "Suspendido"
                      : "-"}
                  </span>
                </div>

                {/* Match time */}
                {match.status === "pending" && (
                  <div className="text-xs mt-1">
                    {new Date(match.date).toLocaleDateString()} {match.time}
                  </div>
                )}
              </div>

              {/* Visitor team */}
              <div className="text-center w-24">
                <img
                  src={match.visitor.logo}
                  alt={match.visitor.name}
                  className="h-8 mx-auto mb-1"
                />
                <span className="text-sm font-semibold">
                  {match.visitor.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right scroll button (only visible when there's more to scroll) */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-0 bottom-0 z-10 bg-gray-900 bg-opacity-50 px-2 flex items-center justify-center"
      >
        <FaChevronRight className="text-xl" />
      </button>
    </div>
  );
};

export default LiveMatchesTicker;
