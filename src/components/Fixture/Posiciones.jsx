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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const positions = useSelector((state) => state.positions);
  const generalPositions = useSelector((state) => state.generalPositions);

  const categories = [
    { value: "A1", label: "FSP Masculino", logo: logoA1 },
    { value: "F1", label: "FSP Femenino", logo: logoF1 },
    // { value: "DH", label: "DH Honor", logo: logoDH },
    // { value: "CM", label: "CM Mendoza", logo: logoCM }
  ];

  useEffect(() => {
    dispatch(getPositions(positionState));
    dispatch(getGeneralPositions(positionState));
  }, [positionState, dispatch]);

  const selectedCategory = categories.find(
    (cat) => cat.value === positionState
  );

  return (
    <div className="pl-[70px] flex flex-col justify-between min-h-screen">
      <Sidebar active={"positions"} />

      <header className="w-full bg-zinc-900 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-white text-center md:text-left italic">
              {" "}
              {`${
                positionState === "F1" ? "FSP Femenino" : "FSP Masculino"
              } - Posiciones`}
            </h2>

            {/* Selector Dropdown con indicación */}
            <div className="flex flex-col items-center">
              <p className="text-gray-400 text-sm mb-1 animate-pulse">
                Selecciona una categoría ▼
              </p>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between px-4 py-2 bg-zinc-800 text-white rounded-md border border-zinc-700 hover:bg-zinc-700 transition-colors"
                  aria-label="Cambiar categoría de posiciones"
                >
                  <div className="flex items-center">
                    <img
                      src={selectedCategory?.logo}
                      alt={selectedCategory?.label}
                      className="w-6 h-6 mr-2 rounded-full object-cover"
                    />
                    <span>{selectedCategory?.label}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-md shadow-lg">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => {
                          setPositionState(category.value);
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-zinc-700 transition-colors"
                      >
                        <img
                          src={category.logo}
                          alt={category.label}
                          className="w-6 h-6 mr-2 rounded-full object-cover"
                        />
                        {category.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <section className="py-4 w-full h-auto flex flex-col lg:flex-row gap-4 justify-center items-center overflow-hidden lg:py-4 ">
        {positions?.image ? (
          <>
            <div className="relative group max-w-xl w-full bg-zinc-900 p-4 rounded-lg">
              <h3 className="text-2xl text-center lg:text-3xl font-bold text-white mb-2">
                Actual
              </h3>
              <div
                className="cursor-pointer group h-full"
                onClick={() => setModalImage(positions.image)}
              >
                <img
                  className="w-full max-h-[70vh] rounded-xl group-hover:brightness-95 transition-all object-contain"
                  src={positions.image}
                  alt="Tabla de posiciones - Torneo actual"
                  loading="lazy"
                />
                <div className="absolute bottom-3 right-3 bg-black/50 rounded-full p-2 backdrop-blur-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* <hr className="my-6 border-gray-700 w-full max-w-xl" /> */}

            {generalPositions ? (
              <>
                <div className="relative group max-w-xl w-full bg-zinc-900 p-4 rounded-lg">
                  <h3 className="text-2xl text-center lg:text-3xl font-bold text-white mb-2">
                    Tabla General
                  </h3>
                  <div
                    className="cursor-pointer group h-full"
                    onClick={() => setModalImage(generalPositions.image)}
                  >
                    <img
                      className="w-full max-h-[70vh] rounded-xl group-hover:brightness-95 transition-all object-contain"
                      src={generalPositions.image}
                      alt="Tabla de posiciones - General"
                      loading="lazy"
                    />
                    <div className="absolute bottom-3 right-3 bg-black/50 rounded-full p-2 backdrop-blur-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                    </div>
                  </div>
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
          className="ml-[70px] fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="max-w-full max-h-full">
            <img
              src={modalImage}
              alt="Vista ampliada"
              className="max-w-full max-h-[80VH] object-contain"
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
