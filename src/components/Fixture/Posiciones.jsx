import Sidebar from "../NavBar/Sidebar";
import posicionesA1 from "../../assets/images/fixture-resultados/A1/posiciones/posiciones1.jpg";
import posicionesFemA from "../../assets/images/fixture-resultados/FemA/posiciones/posiciones1.jpg";
import FooterComp from "../FooterComp/FooterComp";
import logoA1 from "../../assets/images/botones/A1.webp";
import logoF1 from "../../assets/images/botones/F1.png";

import { useState } from "react";

const Posiciones = () => {
  const [positionState, setPositionState] = useState("A1");



  return (
    <>
      <Sidebar />
      <section className="pl-[70px] w-full flex flex-col justify-center items-center bg-zinc-900 gap-2 py-4 lg:py-6">
        <h2 className="text-xl mb-2 italic lg:mb-4 lg:text-2xl  text-gray-200 font-bold">POSICIONES</h2>
        <picture className="flex justify-center items-center overflow-hidden gap-8 lg:gap-12">
          <img
            src={logoA1}
            name="A1"
            className={`w-12  ${positionState === "A1" ? "scale-110" : null } cursor-pointer hover:scale-105 duration-300 object-cover lg:w-16`}
            alt=""
            onClick={(e) => setPositionState(e.target.name)}
          />
          <img
            src={logoF1}
            name="FEM"
            className={`w-12 cursor-pointer ${positionState === "FEM" ? "scale-110" : null } hover:scale-110 duration-300 object-cover lg:w-16`}
            alt=""
            onClick={(e) => setPositionState(e.target.name)}
          />
        </picture>
      </section>
      <section className="py-6 w-full h-auto flex flex-col justify-center items-center overflow-hidden lg:py-12 ">
        <h2 className="ml-[70px] text-xl text-center mb-6  lg:text-3xl font-bold text-zinc-800">
          {positionState === "A1" ? "A1xSuela" : "FemAxSuela"}
        </h2>
        <img
          className="ml-[70px] w-4/5 max-w-xl lg:rounded-xl"
          src={positionState === "A1" ? posicionesA1 : posicionesFemA}
          alt=""
        />
      </section>

      <FooterComp />
    </>
  );
};

export default Posiciones;
