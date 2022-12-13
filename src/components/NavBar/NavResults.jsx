import React from "react";

import suela from "../../assets/images/suela.png";
import aleman from "../../assets/images/aleman.png";
import godoy from "../../assets/images/godoy.png";
import gye from "../../assets/images/gye.png";
import calendario from "../../assets/images/calendario.png";
import { Navbar } from "flowbite-react";
import CategoryHome from "../Buttons/CategoryHome";
import { useSelector } from "react-redux";

export default function NavResults() {
  const matches = useSelector((state) => state.allMatches);
  console.log("AMMAMA", matches);
  return (
    <div className="m-2 flex items-center justify-center border-t border-b border-[#E96F22] rounded-lg w-full">
      {matches.length > 0 ? (
        matches.map((match) => (
          <section>
            <div className="m-2 h-24 w-36 border rounded-lg">
              <span className="flex flex-row items-center m-1 justify-between">
                <div className="flex flex-col">
                  <img src={match?.Teams[0]?.logo} alt="local" className="w-6 h-6" />
                  <h5 className="text-white font-bold text-[10px]">{match?.Teams[0]?.short_name}</h5>
                </div>
                <h5 className="text-white font-bold text-[13px]">{match.local_score}</h5>
                <h5 className="text-white font-bold text-[13px]">{match.visitor_score}</h5>
                <div className="flex flex-col">
                  <img src={match?.Teams[1]?.logo} alt="visitor" className="w-6 h-6" />
                  <h5 className="text-white font-bold text-[10px]">{match?.Teams[1]?.short_name}</h5>
                </div>
              </span>
              
              <div className="border-t flex justify-center m-1">
                {match.finished === false ? (
                  <h5 className="text-green-300 font-bold text-[10px] ">
                    {" "}
                    {match.date}{" "}
                  </h5>
                ) : (
                  <h5 className="text-red-300 font-bold text-[10px] ">
                  Partido terminado
                </h5>
                )}
              </div>
              <div className="border-t flex justify-center m-1">
                <h5 className="text-white font-bold text-[8px] ">Cancha:</h5>
                <h5 className="text-white font-bold text-[8px] ">
                  {match.place}
                </h5>
              </div>
            </div>
          </section>
        ))
      ) : (
        <span>"Nada que mostrar"</span>
      )}
      <div className="m-2 bg-white p-2 rounded-lg w-12 border flex flex-col items-center">
        <img src={calendario} alt="" />
        <span className="">Todos</span>
        <h5 className=" text-black font-bold text-[25px] h-5 ">→</h5>
      </div>
    </div>
  );
}
