import fixture1 from "../../assets/images/fixture-resultados/A1/fixture1.webp";
import fixture2 from "../../assets/images/fixture-resultados/A1/fixture2.webp";
import fixture3 from "../../assets/images/fixture-resultados/A1/fixture3.webp";
import fixture4 from "../../assets/images/fixture-resultados/A1/fixture4.webp";
import fixture6 from "../../assets/images/fixture-resultados/A1/fixture6.webp";
import fixture7 from "../../assets/images/fixture-resultados/A1/fixture7.webp";
import fixture8 from "../../assets/images/fixture-resultados/A1/fixture8.webp";
import fixture9 from "../../assets/images/fixture-resultados/A1/fixture9.webp";
import fixture10 from "../../assets/images/fixture-resultados/A1/fixture10.webp";
import fixture11 from "../../assets/images/fixture-resultados/A1/fixture11.webp";
import fixture12 from "../../assets/images/fixture-resultados/A1/fixture12.webp";
import fixture13 from "../../assets/images/fixture-resultados/A1/fixture13.webp";
import fixture14 from "../../assets/images/fixture-resultados/A1/fixture14.webp";

import FEMfixture1 from "../../assets/images/fixture-resultados/FemA/fixture1.webp";
import FEMfixture2 from "../../assets/images/fixture-resultados/FemA/fixture2.webp";
import FEMfixture3 from "../../assets/images/fixture-resultados/FemA/fixture3.webp";
import FEMfixture4 from "../../assets/images/fixture-resultados/FemA/fixture4.webp";
import FEMfixture5 from "../../assets/images/fixture-resultados/FemA/fixture5.webp";
import FEMfixture6 from "../../assets/images/fixture-resultados/FemA/fixture6.webp";
import FEMfixture7 from "../../assets/images/fixture-resultados/FemA/fixture7.webp";
import FEMfixture8 from "../../assets/images/fixture-resultados/FemA/fixture8.webp";
import FEMfixture9 from "../../assets/images/fixture-resultados/FemA/fixture9.webp";
import FEMfixture10 from "../../assets/images/fixture-resultados/FemA/fixture10.webp";
import FEMfixture11 from "../../assets/images/fixture-resultados/FemA/fixture11.webp";

import Sidebar from "../NavBar/Sidebar";

import logoA1 from "../../assets/images/botones/A1.webp";
import logoF1 from "../../assets/images/botones/F1.png";
import logoTI from "../../assets/images/botones/TI.webp";
import logoTN from "../../assets/images/botones/TN.webp";

import resultado1F from "../../assets/images/fixture-resultados/FemA/resultado1.jpg";
import resultado2F from "../../assets/images/fixture-resultados/FemA/resultado2.jpg";
import { useState } from "react";

const Fixture = () => {
  const [fixtureState, setFixtureState] = useState("A1");

  const fixtureA1 = [
    fixture2,
    fixture4,
    fixture3,
    fixture6,
    fixture1,
    fixture7,
    fixture8,
    fixture9,
    fixture10,
    fixture11,
    fixture12,
    fixture13,
    fixture14,
  ];
  const fixtureF1 = [
    resultado1F,
    resultado2F,
    FEMfixture1,
    FEMfixture2,
    FEMfixture3,
    FEMfixture4,
    FEMfixture5,
    FEMfixture6,
    FEMfixture7,
    FEMfixture8,
    FEMfixture9,
    FEMfixture10,
    FEMfixture11,
  ];

  return (
    <>
      <Sidebar />
      <section className="pl-[70px] w-full flex flex-col justify-center items-center bg-zinc-900 gap-2 py-6">
        <h2 className="text-2xl text-white font-bold">FIXTURE</h2>
        <picture className="flex justify-center items-center overflow-hidden gap-3 lg:px-8 lg:gap-8">
          <img
            src={logoA1}
            name="A1"
            className="w-16 h-16  cursor-pointer hover:scale-105 duration-300 object-cover"
            alt=""
            onClick={(e) => setFixtureState(e.target.name)}
          />
          <img
            src={logoF1}
            name="FEM"
            className="w-16 h-16 cursor-pointer hover:scale-110 duration-300 object-cover"
            alt=""
            onClick={(e) => setFixtureState(e.target.name)}
          />
        </picture>
      </section>

      {fixtureState === "A1" ? (
        <>
          <h2 className="ml-[70px] text-xl text-center py-2 mb-6 lg:py-6 lg:text-3xl font-bold text-zinc-800">
            A1xSuela
          </h2>
          <section className="w-full h-auto flex flex-wrap gap-2 justify-center items-center overflow-hidden pl-[70px] lg:gap-8">
            {fixtureA1
              .map((fixture, i) => (
                <img
                  id={i + 1}
                  className="w-[97%] max-w-xl rounded-md lg:rounded-xl"
                  src={fixture}
                />
              ))
              .reverse()}
          </section>
        </>
      ) : (
        <>
          <h2 className="ml-[70px] text-xl text-center py-2 mb-6 lg:py-6 lg:text-3xl font-bold text-zinc-800">
            FemAxSuela
          </h2>
          <section className="w-full h-auto flex flex-wrap justify-center items-center overflow-hidden pl-[70px] lg:gap-8 ">
            {fixtureF1
              .map((fixture, index) => (
                <img
                  key={index}
                  className=" w-[97%] max-w-xl lg:rounded-xl rounded-md"
                  src={fixture}
                  alt=""
                />
              ))
              .reverse()}
          </section>
        </>
      )}
    </>
  );
};
export default Fixture;
