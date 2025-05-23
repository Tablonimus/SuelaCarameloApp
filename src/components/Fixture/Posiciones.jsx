import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";
import logoA1 from "../../assets/images/botones/A1.webp";
import logoF1 from "../../assets/images/botones/F1.png";
import logoDH from "../../assets/images/botones/DH.png";
import logoCM from "../../assets/images/botones/CM.png";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGeneralPositions, getPositions } from "../../redux/actions";
import NoticeLoaderComponent from "../Home/NoticeLoaderComponent";

const Posiciones = () => {
  const dispatch = useDispatch();

  const [positionState, setPositionState] = useState("A1");
  const positions = useSelector((state) => state.positions);
  const generalPositions = useSelector((state) => state.generalPositions);

  useEffect(() => {
    dispatch(getPositions(positionState));
    dispatch(getGeneralPositions(positionState));
  }, [positionState]);

  return (
    <div className="flex flex-col justify-between  ">
      <Sidebar active={"positions"} />
      <section className="pl-[70px] w-full flex flex-col justify-center items-center bg-zinc-900 gap-2 py-4 lg:py-6">
        {/* <h2 className="text-xl mb-2 italic lg:mb-4 lg:text-2xl  text-gray-200 font-bold">
          POSICIONES
        </h2> */}
        <h2 className="text-xl text-center lg:text-3xl font-bold text-white">
          {`${
            positionState === "F1" ? "Fem" : positionState
          }xSuela - Posiciones`}
        </h2>
        <picture className=" flex justify-center items-center overflow-hidden gap-3 lg:px-8 lg:gap-8">
          <img
            src={logoA1}
            name="A1"
            className={
              positionState === "A1"
                ? "w-10 h-10 lg:w-16 lg:h-16 rounded-full border-4  border-[#F17023] cursor-pointer hover:scale-105 duration-300 object-cover"
                : "w-10 h-10 lg:w-16 lg:h-16 rounded-full  cursor-pointer hover:scale-105 duration-300 object-cover"
            }
            alt="suela caramelo"
            onClick={(e) => setPositionState(e.target.name)}
          />
          <img
            src={logoDH}
            name="DH"
            className={
              positionState === "DH"
                ? "w-10 h-10 lg:w-16 lg:h-16 rounded-full border-4  border-[#F17023] cursor-pointer hover:scale-105 duration-300 object-cover"
                : "w-10 h-10 lg:w-16 lg:h-16 rounded-full  cursor-pointer hover:scale-105 duration-300 object-cover"
            }
            alt="suela caramelo"
            onClick={(e) => setPositionState(e.target.name)}
          />

          <img
            src={logoCM}
            name="CM"
            className={
              positionState === "CM"
                ? "w-10 h-10 lg:w-16 lg:h-16 rounded-full border-4  border-[#F17023] cursor-pointer hover:scale-105 duration-300 object-cover"
                : "w-10 h-10 lg:w-16 lg:h-16 rounded-full  cursor-pointer hover:scale-105 duration-300 object-cover"
            }
            alt="suela caramelo"
            onClick={(e) => setPositionState(e.target.name)}
          />

          <img
            src={logoF1}
            name="F1"
            className={
              positionState === "F1"
                ? "w-10 h-10 lg:w-16 lg:h-16 rounded-full border-4  border-[#F17023] cursor-pointer hover:scale-105 duration-300 object-cover"
                : "w-10 h-10 lg:w-16 lg:h-16 rounded-full  cursor-pointer hover:scale-105 duration-300 object-cover"
            }
            alt="suela caramelo"
            onClick={(e) => setPositionState(e.target.name)}
          />
        </picture>
      </section>
      <section className="py-6 w-full h-auto flex flex-col justify-center items-center overflow-hidden lg:py-12 ">
        {positions?.image ? (
          <>
            <img
              className="ml-[70px] w-4/5 max-w-xl  rounded-xl"
              src={positions.image}
              alt="posiciones futbol de salón mendoza"
              loading="lazy"
            />
            <hr />
            {generalPositions ? (
              <>
                <div className=" w-full text-center pl-14 my-2">
                  <h3 className="text-xl text-center lg:text-3xl font-bold text-white">
                    General
                  </h3>
                </div>
                <img
                  className="ml-[70px] w-4/5 max-w-xl  rounded-xl"
                  src={generalPositions.image}
                  alt="posiciones futbol de salón mendoza"
                  loading="lazy"
                />
              </>
            ) : (
              false
            )}
          </>
        ) : (
          <NoticeLoaderComponent />
        )}
      </section>

      <FooterComp />
    </div>
  );
};

export default Posiciones;
