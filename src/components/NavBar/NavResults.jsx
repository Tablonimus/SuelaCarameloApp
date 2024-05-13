import React from "react";
import { useSelector } from "react-redux";
import { Carousel } from "flowbite-react";
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

  var subarrays = dividirArray(matches.slice(0, 20), 2);

  return (
    <div className="flex flex-row w-full items-center justify-center border-t border-b border-white rounded-t-lg h-full">
      {matches.length > 0 ? (
        <div className="flex overflow-x-auto gap-2 p-1 h-full ">
          <Carousel
            leftControl={<></>}
            rightControl={<></>}
            draggable
            slide
            slideInterval={3000}
          >
            {subarrays.length > 0
              ? subarrays.map((array) => (
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
              : false}
          </Carousel>
        </div>
      ) : (
        <div className="flex w-10/12 flex-col items-center justify-center gap-3 pt-5 pb-14">
          <div className="flex flex-col h-24  w-full justify-center  bg-black bg-opacity-80 border border-[#ED7020] shadow-inner shadow-white rounded-lg">
            <div className="animate-pulse flex flex-col px-5 pt-3 pb-5 gap-2">
              <div className="rounded-full w-1/2 h-6  text-2xl font-bold tracking-tight bg-gray-600"></div>
              <div className="rounded-full w-11/12 h-5 font-normal lg:text-lg bg-gray-600"></div>
            </div>
          </div>
          <div className="flex flex-col h-24  w-full justify-around bg-black bg-opacity-80 border border-[#ED7020] shadow-inner shadow-white rounded-lg">
            <div className="animate-pulse flex flex-col px-5 pt-3 pb-5 gap-2">
              <div className="rounded-full w-1/2 h-6  text-2xl font-bold tracking-tight bg-gray-600"></div>
              <div className="rounded-full w-11/12 h-5 font-normal lg:text-lg bg-gray-600"></div>
            </div>
          </div>
        </div>
      )}
      {/* <div className="rounded-lg border-l p-2 shadow-inner shadow-white border-white flex flex-col items-center justify-center">
          <span className="text-white text-xl">📅</span>
          <span className="text-white text-sm">Todos</span>
          <h5 className=" text-white font-bold text-[25px] ">→</h5>
        </div> */}
    </div>
  );
}
