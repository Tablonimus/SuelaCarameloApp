import React from "react";

import { useSelector } from "react-redux";
import { Spinner } from "flowbite-react";
import MatchResult from "./MatchResult";

export default function NavResults() {
  const matches = useSelector((state) => state.allMatches);

  return (
    <div className=" m-2 flex flex-row w-full border-t border-b border-white rounded-t-lg h-full">
      <div className="flex items-center overflow-x-auto gap-2 p-1  w-full lg:justify-center">
        {matches.length > 0 ? (
          matches.slice(0,10).map((match) => (
            <MatchResult
              key={match.id}
              id={match.id}
              local={match.local}
              local_score={match.local_score}
              visitor={match.visitor}
              visitor_score={match.visitor_score}
              time={match.time}
              date={match.date}
              place={match.place}
              finished={match.finished}
              teams = {match.Teams}
            />
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
