import Sidebar from "../NavBar/Sidebar";
import logoA1 from "../../assets/images/botones/A1.webp";
import logoF1 from "../../assets/images/botones/F1.png";
import logoDH from "../../assets/images/botones/DH.png";
import logoCM from "../../assets/images/botones/CM.png";
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
  const [currentPageTitle, setCurrentPageTitle] = useState(1);

  useEffect(() => {
    dispatch(getFixtures(fixtureState));
    setCurrentPageTitle(activeNumber);
  }, [fixtureState, activeNumber]);

  return (
    <div className="flex flex-col justify-between min-h-screen ">
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
              src={logoDH}
              name="DH"
              className={
                fixtureState === "DH"
                  ? "w-10 h-10 lg:w-16 lg:h-16 rounded-full border-4  border-[#F17023] cursor-pointer hover:scale-105 duration-300 object-cover"
                  : "w-10 h-10 lg:w-16 lg:h-16 rounded-full  cursor-pointer hover:scale-105 duration-300 object-cover"
              }
              alt=""
              onClick={(e) => setFixtureState(e.target.name)}
            />
            <img
              src={logoCM}
              name="CM"
              className={
                fixtureState === "CM"
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
