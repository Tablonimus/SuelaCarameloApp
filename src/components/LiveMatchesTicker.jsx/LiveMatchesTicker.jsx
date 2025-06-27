import React, { useState, useEffect } from "react";
import { FaFutbol, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";

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

        // Refresh every 30s
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
    const scrollAmount = 300;
    if (container) {
      container.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
      setScrollPosition(container.scrollLeft);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 py-2 px-4 text-white text-center text-sm">
        Cargando partidos...
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-zinc-900 py-2 px-4 text-white text-center text-sm">
        No hay partidos en este momento
      </div>
    );
  }

  return (
    <div className="relative bg-zinc-900 py-3 px-2 text-white overflow-hidden">
      {/* Left scroll button */}
      {scrollPosition > 0 && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 bg-black/30 hover:bg-black/50 px-2 flex items-center"
        >
          <FaChevronLeft className="text-white text-xl" />
        </button>
      )}

      {/* Match ticker */}
      <div
        id="matches-ticker"
        className="flex overflow-x-auto space-x-4 px-4 scrollbar-none"
        onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
      >
        {matches.map((match) => (
          <div
            key={match._id}
            className="inline-block px-4 py-3 bg-zinc-800 rounded-xl border border-zinc-700 min-w-[280px] max-w-[320px] shadow-sm"
          >
            <div className="flex items-center justify-between">
              {/* Local team */}
              <div className="flex flex-col items-center w-24">
                <img
                  src={match.local.logo}
                  alt={match.local.name}
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xs font-medium mt-1 text-center">
                  {match.local.name}
                </span>
              </div>

              {/* Score and status */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-xl font-bold flex items-center gap-1">
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

                <div className="flex items-center mt-1 text-xs text-gray-200">
                  {match.status === "playing" && (
                    <FaFutbol className="text-green-400 animate-pulse mr-1" />
                  )}
                  {match.status === "finished" && (
                    <FaFutbol className="text-white mr-1" />
                  )}
                  <span className="uppercase">
                    {{
                      playing: "En vivo",
                      finished: "Finalizado",
                      pending: "Próximo",
                      postponed: "Postergado",
                      canceled: "Suspendido",
                    }[match.status] ?? "-"}
                  </span>
                </div>

                {match.status === "pending" && (
                  <div className="text-center text-[10px] text-gray-200 mt-1">
                    {new Date(match.date).toLocaleDateString()} {match.time}
                  </div>
                )}
              </div>

              {/* Visitor team */}
              <div className="flex flex-col items-center w-24">
                <img
                  src={match.visitor.logo}
                  alt={match.visitor.name}
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xs font-medium mt-1 text-center">
                  {match.visitor.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-0 bottom-0 z-10 bg-black/30 hover:bg-black/50 px-2 flex items-center"
      >
        <FaChevronRight className="text-white text-xl" />
      </button>
    </div>
  );
};

export default LiveMatchesTicker;
