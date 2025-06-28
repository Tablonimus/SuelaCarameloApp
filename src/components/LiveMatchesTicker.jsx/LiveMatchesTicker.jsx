import React, { useState, useEffect } from "react";
import logoSC from "../../assets/images/banner2.png";
import { FaFutbol, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
// const BASE_URL = "http://localhost:3000/sc";

const statusMap = {
  first_half: "1T",
  halftime: "Descanso",
  second_half: "2T",
  extra_time: "Tiempo Extra",
  penalties: "Penales",
  pending: "Próximo",
  finished: "Finalizado",
  suspended: "Suspendido",
  canceled: "Cancelado",
  postponed: "Postergado",
};

const LiveMatchesTicker = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const response = await fetch(BASE_URL + "/matches/live");
        const data = await response.json();
        setMatches(data);
        setLoading(false);
        console.log(data);

        const interval = setInterval(async () => {
          const updated = await fetch(BASE_URL + "/matches/live");
          setMatches(await updated.json());
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
      <div className="w-full flex justify-center items-center pb-2">
        <img className="w-32 md:w-44 " src={logoSC} alt="Logo Suela Caramelo" />
      </div>

      {scrollPosition > 0 && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 bg-black/30 hover:bg-black/50 px-2 flex items-center"
        >
          <FaChevronLeft className="text-white text-xl" />
        </button>
      )}

      <div
        id="matches-ticker"
        className="flex overflow-x-auto space-x-4 px-4 scrollbar-none"
        onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
      >
        {matches.map((match) => (
          <div
            key={match._id}
            className="inline-block bg-zinc-800 border border-zinc-700 p-4 rounded-2xl shadow-md transition-transform hover:scale-[1.02]"
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
                {(match.status === "penalties" ||
                  (match.status === "finished" &&
                    (match.penaltyScore?.local > 0 ||
                      match.penaltyScore?.visitor > 0))) && (
                  <div className="text-xs text-gray-300 mt-0.5">
                    <span className="ml-1">
                      ({match.penaltyScore?.local ?? 0}) - (
                      {match.penaltyScore?.visitor ?? 0})
                    </span>
                  </div>
                )}
                <div className="flex items-center mt-1 text-xs text-gray-200">
                  {[
                    "first_half",
                    "halftime",
                    "second_half",
                    "extra_time",
                    "penalties",
                  ].includes(match.status) && (
                    <FaFutbol className="text-green-400 animate-pulse mr-1" />
                  )}
                  {match.status === "finished" && (
                    <FaFutbol className="text-white mr-1" />
                  )}
                  <span className="">{statusMap[match.status] ?? "-"}</span>
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
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-0 bottom-0 z-10 bg-black/30 hover:bg-black/50 px-2 flex items-center"
      >
        <FaChevronRight className="text-white text-xl" />
      </button>
      {/* Links fijos debajo del ticker */}
      <div className="flex justify-center gap-6 mt-3 text-sm text-blue-300 underline">
        <a href="/fixture" className="hover:text-blue-200 transition">
          Ver Fixture
        </a>
        <a href="/posiciones" className="hover:text-blue-200 transition">
          Ver Posiciones
        </a>
      </div>
    </div>
  );
};

export default LiveMatchesTicker;
