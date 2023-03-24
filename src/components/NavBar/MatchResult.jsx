import React from "react";
import escudoVacio from "../../assets/images/logoVacio.png";

export default function MatchResult({
  id,
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

  return (
    <div className="flex flex-col w-36 h-full  justify-center items-center  border border-[#E96F22] shadow-inner shadow-white rounded-lg">
      <div className=" w-24 flex flex-row items-center m-1 justify-between">
        <div className="flex flex-col items-center justify-center">
          <img
            src={localLogo || escudoVacio}
            alt="local"
            className="w-6 h-6 rounded-full bg-white"
          />
          <h5 className="text-white font-bold text-[10px]">{local}</h5>
        </div>
        <h5 className="text-white font-bold text-[13px]">{local_score}</h5>
        <h5 className="text-white font-bold text-[13px]">{visitor_score}</h5>
        <div className="flex flex-col items-center justify-center">
          <img
            src={visitorLogo || escudoVacio}
            alt="visitor"
            className="w-6 h-6 rounded-full bg-white"
          />
          <h5 className="text-white font-bold text-[10px]">{visitor}</h5>
        </div>
      </div>

      <div className="border-t border-[#E96F22] flex justify-center m-1">
        {finished === false ? (
          <h5 className="text-green-300 font-bold text-[10px] ">
            {" "}
            {time} - {date.split("-").reverse().join("/")}
          </h5>
        ) : (
          <h5 className="text-red-300 font-bold text-[10px] ">
            Partido terminado
          </h5>
        )}
      </div>
      <div className="border-t flex justify-center m-1">
        <h5 className="text-white font-bold text-[10px] ">Cancha: {place}</h5>
      </div>
    </div>
  );
}
