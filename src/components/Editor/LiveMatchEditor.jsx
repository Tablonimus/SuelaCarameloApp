import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
const statusOptions = [
  { value: "first_half", label: "1er Tiempo" },
  { value: "halftime", label: "Descanso" },
  { value: "second_half", label: "2do Tiempo" },
  { value: "extra_time", label: "Tiempo Extra" },
  { value: "penalties", label: "Penales" },
  { value: "finished", label: "Finalizado" },
];

export default function LiveMatchEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await fetch(`${BASE_URL}/matches/${id}`);
        const data = await res.json();
        setMatch(data);
      } catch {
        setError("Error al cargar el partido.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  const updateScore = (team, delta, isPenalty = false) => {
    setMatch((prev) => {
      const target = isPenalty ? "penaltyScore" : "score";
      const current = prev[target][team] || 0;
      return {
        ...prev,
        [target]: {
          ...prev[target],
          [team]: Math.max(0, current + delta),
        },
      };
    });
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/matches/${id}/score`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          localScore: match.score.local,
          visitorScore: match.score.visitor,
          status: match.status,
          penaltyScore: match.penaltyScore,
        }),
      });
      if (!res.ok) throw new Error();
      // Mantenerse en la misma vista tras guardar
      // navigate("/editor");
    } catch {
      setError("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-6 text-gray-100 font-semibold bg-black bg-opacity-30 px-4 py-2 rounded-xl">
        Cargando...
      </div>
    );
  if (!match)
    return (
      <div className="text-center mt-6 text-red-600 font-bold bg-black bg-opacity-30 px-4 py-2 rounded-xl">
        {error}
      </div>
    );

  return (
    <div className="p-4 max-w-md mx-auto text-white min-h-screen flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate("/editor")}
          className="text-white font-semibold drop-shadow-md border border-white-1 p-2 rounded-full hover:bg-white hover:text-orange-500"
        >
          ← Volver
        </button>
      </div>

      <div className="text-center mb-2 text-2xl font-bold bg-black bg-opacity-30 px-3 py-2 rounded-xl drop-shadow-md">
        {match.local.name} vs {match.visitor.name}
      </div>
      <div className="text-center text-sm text-gray-100 mb-4 bg-black bg-opacity-40 px-3 py-2 rounded-xl drop-shadow-md">
        🕒 {match.time} | 📅 {new Date(match.date).toLocaleDateString()} | 🏷️{" "}
        {match.category}
      </div>

      <div className="flex justify-center items-center gap-4 text-3xl font-extrabold mb-6 drop-shadow-md">
        <img
          src={match.local.logo || "/default-logo.png"}
          alt="local"
          className="w-10 h-10"
        />
        <span className="drop-shadow-lg">
          {match.score.local} : {match.score.visitor}
        </span>
        <img
          src={match.visitor.logo || "/default-logo.png"}
          alt="visitante"
          className="w-10 h-10"
        />
      </div>

      {/* Goles */}
      <div className="space-y-6 mb-6">
        {["local", "visitor"].map((team) => (
          <div
            key={team}
            className="flex items-center justify-between text-white"
          >
            <span className="capitalize font-semibold drop-shadow-md">
              {match[team].name}
            </span>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => updateScore(team, -1)}
                className="bg-white text-black rounded-full w-12 h-12 text-2xl font-bold shadow-md"
              >
                -
              </button>
              <span className="text-2xl w-8 text-center font-bold drop-shadow-md">
                {match.score[team]}
              </span>
              <button
                onClick={() => updateScore(team, 1)}
                className="bg-white text-black rounded-full w-12 h-12 text-2xl font-bold shadow-md"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Estados */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {statusOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setMatch((prev) => ({ ...prev, status: value }))}
            className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm border ${
              match.status === value
                ? "bg-white text-orange-600 shadow-md"
                : "bg-black bg-opacity-20 text-white border-white border-opacity-20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Penales (si aplica) */}
      {(match.status === "penalties" ||
        match.penaltyScore.local > 0 ||
        match.penaltyScore.visitor > 0) && (
        <div className="space-y-4 mb-6">
          <h4 className="text-center font-semibold text-sm text-white drop-shadow-sm">
            Penales
          </h4>
          {["local", "visitor"].map((team) => (
            <div
              key={team}
              className="flex items-center justify-between text-white"
            >
              <span className="capitalize font-semibold drop-shadow-md">
                {match[team].name}
              </span>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => updateScore(team, -1, true)}
                  className="bg-white text-black rounded-full w-12 h-12 text-2xl font-bold shadow-md"
                >
                  -
                </button>
                <span className="text-2xl w-8 text-center font-bold drop-shadow-md">
                  {match.penaltyScore[team]}
                </span>
                <button
                  onClick={() => updateScore(team, 1, true)}
                  className="bg-white text-black rounded-full w-12 h-12 text-2xl font-bold shadow-md"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={saveChanges}
        disabled={saving}
        className="w-full py-4 rounded-xl bg-white text-orange-600 font-extrabold text-lg shadow-lg hover:brightness-95 transition drop-shadow-xl"
      >
        {saving ? "Guardando..." : "✅ Guardar Cambios"}
      </button>
    </div>
  );
}
