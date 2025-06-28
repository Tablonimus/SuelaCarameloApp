import Sidebar from "../NavBar/Sidebar";
import FooterComp from "../FooterComp/FooterComp";
import logoA1 from "../../assets/images/botones/A1.png";
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
  const [modalImage, setModalImage] = useState(null);
  const positions = useSelector((state) => state.positions);
  const generalPositions = useSelector((state) => state.generalPositions);

  useEffect(() => {
    dispatch(getPositions(positionState));
    dispatch(getGeneralPositions(positionState));
  }, [positionState]);

  return (
    <div className="pl-[70px] flex flex-col justify-between min-h-screen  ">
      <Sidebar active={"positions"} />
      <section className=" w-full flex flex-col justify-center items-center bg-zinc-900 gap-2 py-4 lg:py-6">
        <h2 className="text-xl border-b w-full  text-center pb-2 italic lg:mb-4 lg:text-2xl  text-gray-200 font-bold uppercase">
          {`${
            positionState === "F1" ? "FSP Femenino" : "FSP Masculino"
          } - Posiciones`}
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
          {/* <img
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
          /> */}

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

      <section className=" py-6 w-full h-auto flex flex-col justify-center items-center overflow-hidden lg:py-12">
        {positions?.image ? (
          <>
            <div onClick={() => setModalImage(positions.image)}>
              <img
                className="w-full  max-w-xl rounded-xl cursor-pointer hover:opacity-90"
                src={positions.image}
                alt="posiciones futbol de salón mendoza"
                loading="lazy"
              />
            </div>
            <hr />
            {generalPositions ? (
              <>
                <div className="w-full text-center my-2">
                  <h3 className="text-xl text-center lg:text-3xl font-bold text-white">
                    General
                  </h3>
                </div>
                <div onClick={() => setModalImage(generalPositions.image)}>
                  <img
                    className="w-full  max-w-xl rounded-xl cursor-pointer hover:opacity-90"
                    src={generalPositions.image}
                    alt="posiciones futbol de salón mendoza"
                    loading="lazy"
                  />
                </div>
              </>
            ) : (
              false
            )}
          </>
        ) : (
          <NoticeLoaderComponent />
        )}
      </section>

      {/* Modal para imagen en pantalla completa */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="max-w-full max-h-full">
            <img
              src={modalImage}
              alt="Vista ampliada"
              className="max-w-full max-h-screen object-contain"
            />
          </div>
          <button
            className="absolute top-4 right-4 text-white text-2xl bg-red-500 rounded-full w-10 h-10 flex items-center justify-center"
            onClick={() => setModalImage(null)}
          >
            ×
          </button>
        </div>
      )}

      <FooterComp />
    </div>
  );
};

export default Posiciones;
