import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
const validStatuses = [
  "pending",
  "first_half",
  "second_half",
  "extra_time",
  "penalties",
];

const MatchSelector = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(BASE_URL + "/matches");
        const data = await res.json();
        const filtered = data.filter((m) => validStatuses.includes(m.status));
        setMatches(filtered);
      } catch (err) {
        setError("No se pudieron cargar los partidos");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-6 text-gray-400">Cargando partidos...</p>
    );
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-md mx-auto min-h-screen">
      <h2 className="text-xl font-semibold text-center mb-6">
        📲 Seleccioná el partido a cubrir
      </h2>

      <div className="flex flex-col gap-4">
        {matches.map((match) => (
          <div
            key={match._id}
            className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/editor/${match._id}`)}
          >
            <div className="flex items-center gap-4 mb-2">
              <img
                src={match?.local?.logo || "/default-logo.png"}
                alt="local logo"
                className="w-10 h-10 object-contain"
              />
              <div className="text-lg font-bold text-gray-800 flex-1 text-center">
                {match?.local?.name || "Local"} vs{" "}
                {match?.visitor?.name || "Visitante"}
              </div>
              <img
                src={match?.visitor?.logo || "/default-logo.png"}
                alt="visitor logo"
                className="w-10 h-10 object-contain"
              />
            </div>

            <div className="text-sm text-gray-600 text-center">
              🕒 {match.time || "-"} | 📅{" "}
              {new Date(match.date).toLocaleDateString()} | 🏷️ {match.category}
            </div>

            <div className="mt-3 text-center text-orange-500 font-semibold text-sm underline">
              Cubrir partido
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchSelector;
