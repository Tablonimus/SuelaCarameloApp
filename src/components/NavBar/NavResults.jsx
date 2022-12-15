import React from "react";

import { useSelector } from "react-redux";
import { Spinner } from "flowbite-react";

export default function NavResults() {
  const matches = useSelector((state) => state.allMatches);

  return (
    <div className=" m-2 flex flex-row w-full border-t border-b border-white rounded-t-lg h-full">
      <div className="flex items-center overflow-x-auto  lg:justify-center  w-full">
        {matches.length > 0 ? (
          matches.map((match) => (
            <section className="" key={match.id}>
              <div className=" m-2 h-24 w-36 border border-[#E96F22] shadow-inner shadow-white rounded-lg">
                <span className="flex flex-row items-center m-1 justify-between">
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={match?.Teams[0]?.logo}
                      alt="local"
                      className="w-6 h-6 rounded-full bg-white"
                    />
                    <h5 className="text-white font-bold text-[10px]">
                      {match?.Teams[0]?.short_name}
                    </h5>
                  </div>
                  <h5 className="text-white font-bold text-[13px]">
                    {match.local_score}
                  </h5>
                  <h5 className="text-white font-bold text-[13px]">
                    {match.visitor_score}
                  </h5>
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={match?.Teams[1]?.logo}
                      alt="visitor"
                      className="w-6 h-6 rounded-full bg-white"
                    />
                    <h5 className="text-white font-bold text-[10px]">
                      {match?.Teams[1]?.short_name}
                    </h5>
                  </div>
                </span>

                <div className="border-t border-[#E96F22] flex justify-center m-1">
                  {match.finished === false ? (
                    <h5 className="text-green-300 font-bold text-[10px] ">
                      {" "}
                      {match.time} - {match.date.split("-").reverse().join("/")}
                    </h5>
                  ) : (
                    <h5 className="text-red-300 font-bold text-[10px] ">
                      Partido terminado
                    </h5>
                  )}
                </div>
                <div className="border-t flex justify-center m-1">
                  <h5 className="text-white font-bold text-[10px] ">
                    Cancha: {match.place}
                  </h5>
                </div>
              </div>
            </section>
          ))
        ) : (
          <div className="ml-10 flex items-center justify-center gap-5">
            <Spinner
              color="warning"
              aria-label="Warning spinner example"
              size="xl"
            />
            <span className="text-white"> Cargando Resultados</span>
          </div>
        )}
      </div>
      <div className="rounded-lg border-l p-2 shadow-inner shadow-white border-white flex flex-col items-center justify-center">
        <span className="text-white text-xl">📅</span>
        <span className="text-white text-sm">Todos</span>
        <h5 className=" text-white font-bold text-[25px] ">→</h5>
      </div>
    </div>
  );
}
