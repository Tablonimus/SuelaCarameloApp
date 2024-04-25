import fixture1 from "../../assets/images/fixture-resultados/A1/fixture1.webp";
import fixture2 from "../../assets/images/fixture-resultados/A1/fixture2.webp";
import fixture3 from "../../assets/images/fixture-resultados/A1/fixture3.webp";
import fixture4 from "../../assets/images/fixture-resultados/A1/fixture4.webp";
import fixture5 from "../../assets/images/fixture-resultados/A1/fixture5.webp";
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

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFixtures } from "../../redux/actions";
import FixturePagination from "./FixturePagination";
import FooterComp from "../FooterComp/FooterComp";

const Fixture = () => {
  const dispatch = useDispatch();
  const allFixtures = useSelector((state) => state.fixtures);
  const activeNumber = useSelector((state) => state.activeNumber);
  const [fixtureState, setFixtureState] = useState("A1");
  const [currentPageTitle, setCurrentPageTitle] = useState(activeNumber);
console.log(activeNumber);
  useEffect(() => {
    dispatch(getFixtures(fixtureState));
  }, [fixtureState]);

  return (
    <div className="flex flex-col justify-between ">
      <Sidebar active={"fixture"} />
      <main>
        <section className="pl-[70px] w-full flex flex-col justify-center items-center bg-zinc-900 gap-2 py-4 lg:py-6">
          <h2 className="text-xl text-center lg:py-2 lg:text-3xl font-bold text-white">
            {`${
              fixtureState === "F1" ? "Fem" : fixtureState
            }xSuela - Fecha ${currentPageTitle}`}
            {/* {`Fecha ${currentPageTitle}`} */}
          </h2>
          <picture className=" flex justify-center items-center overflow-hidden gap-3 lg:px-8 lg:gap-8">
            <img
              src={logoA1}
              name="A1"
              className={
                fixtureState === "A1"
                  ? "w-10 h-10 lg:w-16 lg:h-16 rounded-full border-4  border-[#F17023] cursor-pointer hover:scale-105 duration-300 object-cover"
                  : "w-10 h-10 lg:w-16 lg:h-16 rounded-full  cursor-pointer hover:scale-105 duration-300 object-cover"
              }
              alt=""
              onClick={(e) => setFixtureState(e.target.name)}
            />
            <img
              src={logoF1}
              name="F1"
              className={
                fixtureState === "F1"
                  ? "w-10 h-10 lg:w-16 lg:h-16 rounded-full border-4  border-[#F17023] cursor-pointer hover:scale-105 duration-300 object-cover"
                  : "w-10 h-10 lg:w-16 lg:h-16 rounded-full  cursor-pointer hover:scale-105 duration-300 object-cover"
              }
              alt=""
              onClick={(e) => setFixtureState(e.target.name)}
            />
          </picture>
        </section>

        <section className="flex flex-col justify-center items-center ml-[70px] h-full">
          <FixturePagination
            fixtures={allFixtures}
            activeNumber={activeNumber}
            setCurrentPageTitle={setCurrentPageTitle}
          />
        </section>
      </main>

      <FooterComp />
    </div>
  );
};
export default Fixture;
