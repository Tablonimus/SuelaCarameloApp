import React, { useState } from "react";

import { useSelector } from "react-redux";
import { Carousel, Spinner } from "flowbite-react";
import MatchResult from "./MatchResult";

export default function NavResults() {
  const matches = useSelector((state) => state.allMatches);

  function dividirArray(array, elementosPorSubarray) {
    var subarrays = [];
    for (var i = 0; i < array.length; i += elementosPorSubarray) {
      var subarray = array.slice(i, i + elementosPorSubarray);
      subarrays.push(subarray);
    }
    return subarrays;
  }

  // Ejemplo de uso

  var subarrays = dividirArray(matches.slice(0, 20), 2);
  console.log(subarrays);

  return (
    <div className="flex flex-row w-full border-t border-b border-white rounded-t-lg h-full">
      {/* <div className="flex overflow-x-auto gap-2 p-1  ">
        {matches.length > 0 ? (
          matches
            .slice(0, 10)
            .map((match) => (
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
                teams={match.Teams}
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
      </div> */}
      <div className="flex overflow-x-auto gap-2 p-1 h-full ">
        <Carousel slideInterval={5000}>
          {subarrays.length > 0 ? (
            subarrays.map((array) => (
              <>
                <div className="flex flex-col items-center justify-center gap-3 pt-5 pb-14">
                  {array.map((match) => (
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
                      teams={match.Teams}
                    />
                  ))}
                </div>
              </>
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
        </Carousel>
      </div>
      {/* <div className="rounded-lg border-l p-2 shadow-inner shadow-white border-white flex flex-col items-center justify-center">
          <span className="text-white text-xl">📅</span>
          <span className="text-white text-sm">Todos</span>
          <h5 className=" text-white font-bold text-[25px] ">→</h5>
        </div> */}
    </div>
  );
}
