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
  const local_name =
    local === teams[0]?.short_name ? teams[0]?.name : teams[1]?.name;
  const visitor_name =
    visitor === teams[0]?.short_name ? teams[0]?.name : teams[1]?.name;

  return (
    <div className="flex flex-col  w-9/12 h-full justify-around items-center bg-[#ED7020]   border border-[#ED7020] shadow-inner shadow-white rounded-lg">
      <div className=" w-11/12 md:w-11/12 flex flex-row items-center p-2 lg:mt-6 gap-1 justify-between">
        <div className=" w-1/2 flex flex-row items-center justify-between gap-3 ">
          <img
            src={localLogo || escudoVacio}
            alt="local"
            className="w-10 h-10 md:w-20 md:h-20 rounded-full bg-white"
          />
          <h5 className="  text-white font-bold text-[11px] lg:text-3xl ">
            {local_name}
          </h5>
          <h5 className="text-white font-bold text-[13px] lg:text-3xl  md-text-lg">
            {local_score}
          </h5>
        </div>
        <span className="text-white text-lg">{` - `} </span>
        <div className="  w-1/2 flex flex-row items-center justify-between gap-3 lg:gap-2">
          <h5 className="text-white font-bold text-[13px] lg:text-3xl  md-text-lg">
            {visitor_score}
          </h5>
          <h5 className="text-white font-bold text-[11px] lg:text-3xl ">
            {visitor_name}
          </h5>
          <img
            src={visitorLogo || escudoVacio}
            alt="visitor"
            className="w-10 h-10 md:w-20 md:h-20 rounded-full bg-white"
          />
        </div>
      </div>
      <div className="flex border-t pb-2">
        <div className=" flex justify-center m-1">
          {finished === false ? (
            <h5 className="text-red-300 font-bold text-[10px] md:text-[13px]"></h5>
          ) : (
            <h5 className="text-red-600 font-bold text-[10px] md:text-[13px]">
              Partido terminado
            </h5>
          )}
        </div>
        <div className="flex justify-center m-1">
          <h5 className="text-white font-bold text-[10px] md:text-[13px]">
            Cancha: {place}
          </h5>
        </div>
        <div className="flex justify-center m-1">
          <h5 className="text-white font-bold text-[10px] md:text-[13px]">
            {" "}
            {time} - {date.split("-").reverse().join("/")}
          </h5>
        </div>
      </div>
    </div>
  );
}
