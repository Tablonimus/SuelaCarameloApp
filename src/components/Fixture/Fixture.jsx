import Sidebar from "../NavBar/Sidebar";
import logoA1 from "../../assets/images/botones/A1.png";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(getFixtures(fixtureState));
    setCurrentPageTitle(activeNumber);
  }, [fixtureState, activeNumber]);

  const categories = [
    { value: "A1", label: "FSP Masculino", logo: logoA1 },
    { value: "F1", label: "FSP Femenino", logo: logoF1 },
    // { value: "DH", label: "DH Honor", logo: logoDH },
    // { value: "CM", label: "CM Mendoza", logo: logoCM }
  ];

  const selectedCategory = categories.find((cat) => cat.value === fixtureState);

  return (
    <div className="pl-[70px] flex flex-col justify-between min-h-screen ">
      <Sidebar active={"fixture"} />

      <main>
        <header className="w-full bg-zinc-900 py-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-white text-center md:text-left italic">
                {`${
                  fixtureState === "F1" ? "FSP Femenino" : "FSP Masculino"
                } - Fecha ${currentPageTitle}`}
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
                    aria-label="Selector de categorías"
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
                            setFixtureState(category.value);
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

        <section className="flex flex-col justify-center items-center h-full">
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
