import React from "react";
import escudoVacio from "../../assets/images/logoVacio.png";

export default function MatchResult({
  local,
  local_score,
  visitor,
  visitor_score,
  time,
  date,
  place,
  finished,
  teams,
}) {
  const localLogo =
    local === teams[0]?.short_name
      ? teams[0]?.logo || escudoVacio
      : teams[1]?.logo || escudoVacio;
  const visitorLogo =
    visitor === teams[0]?.short_name
      ? teams[0]?.logo || escudoVacio
      : teams[1]?.logo || escudoVacio;
  const local_name =
    local === teams[0]?.short_name ? teams[0]?.name : teams[1]?.name;
  const visitor_name =
    visitor === teams[0]?.short_name ? teams[0]?.name : teams[1]?.name;

  const formattedDate = date?.split("-").reverse().join("/");

  return (
    <div className="flex flex-col w-full bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">

      {/* Barra de estado */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10">
        {finished === false ? (
          <span className="flex items-center gap-1.5 text-[10px] font-black text-orange-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            En vivo
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">
            Finalizado
          </span>
        )}
        {(time || date) && (
          <span className="text-[10px] text-zinc-600">
            {time}{time && date ? " · " : ""}{formattedDate}
          </span>
        )}
      </div>

      {/* Equipos y marcador */}
      <div className="flex items-center justify-between px-4 py-4 gap-2">

        {/* Local */}
        <div className="flex flex-col items-center gap-1.5 w-2/5">
          <img
            src={localLogo}
            alt={local_name}
            className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md"
          />
          <p className="text-white text-[10px] md:text-xs font-bold text-center leading-tight line-clamp-2">
            {local_name}
          </p>
        </div>

        {/* Marcador */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-3xl md:text-4xl font-black text-white tabular-nums">
              {local_score}
            </span>
            <span className="text-zinc-600 font-bold text-xl">—</span>
            <span className="text-3xl md:text-4xl font-black text-white tabular-nums">
              {visitor_score}
            </span>
          </div>
        </div>

        {/* Visitante */}
        <div className="flex flex-col items-center gap-1.5 w-2/5">
          <img
            src={visitorLogo}
            alt={visitor_name}
            className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md"
          />
          <p className="text-white text-[10px] md:text-xs font-bold text-center leading-tight line-clamp-2">
            {visitor_name}
          </p>
        </div>

      </div>

      {/* Pie: cancha */}
      {place && (
        <div className="px-3 py-1.5 border-t border-white/10">
          <p className="text-[10px] text-zinc-600 text-center">
            <i className="bx bx-map-pin mr-1" />
            {place}
          </p>
        </div>
      )}

    </div>
  );
}
